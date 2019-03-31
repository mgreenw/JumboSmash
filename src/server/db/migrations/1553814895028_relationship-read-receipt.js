exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    critic_read_message_timestamp: {
      type: 'timestamptz',
      default: null,
    },
    critic_read_message_id: {
      type: 'integer',
      references: 'messages',
      default: null,
    },
  });

  pgm.addConstraint(
    'relationships',
    'read_message_id_and_timestamp_both_null_or_exist',
    'CHECK ((num_nulls(critic_read_message_timestamp, critic_read_message_id) = 2) OR (num_nulls(critic_read_message_timestamp, critic_read_message_id) = 0))',
  );

  // Constraints on inserting a read receipt
  // 1. Once a read receipt exists for a conversation it cannot be removed
  // 2. A new read receipt's timestamp must be after the previous read receipts timestamp
  // 3. A new read message must be different from AND sent after the old read message
  // 4. Only messages from the critic's match can be read
  // 5. The read timestamp of the message must be after the sent timestamp of the message
  pgm.createTrigger('relationships', 'read_receipt_constraint', {
    when: 'before',
    operation: ['insert', 'update'],
    level: 'row',
    language: 'plpgsql',
  }, `
    DECLARE
      _sender_user_id              integer;
      _receiver_user_id            integer;
      _from_system                 boolean;
      _timestamp                   timestamptz;
      _last_read_message_timestamp timestamptz;
    BEGIN
      IF NEW.critic_read_message_id IS NULL THEN
        IF TG_OP = 'UPDATE' AND OLD.critic_read_message_id IS NOT NULL THEN
          RAISE EXCEPTION 'Cannot delete a read receipt once it has been created' USING HINT = 'CANNOT_DELETE_READ_RECEIPT';
        END IF;

        /* Because we are not inserting a read receipt, we allow the insertion/update to continue */
        RETURN NEW;
      END IF;

      /* Select some data about the message to be read */
      SELECT
        sender_user_id, receiver_user_id, from_system, timestamp
        INTO _sender_user_id, _receiver_user_id, _from_system, _timestamp
      FROM messages
      WHERE id = NEW.critic_read_message_id;

      IF _from_system THEN
        RAISE EXCEPTION 'A message from the system cannot be read in a read receipt' USING HINT = 'CANNOT_READ_SYSTEM_MESSAGE';
      END IF;

      IF NOT ((_sender_user_id = NEW.critic_user_id AND _receiver_user_id = NEW.candidate_user_id) OR (_sender_user_id = NEW.candidate_user_id AND _receiver_user_id = NEW.critic_user_id)) THEN
        RAISE EXCEPTION 'Given message is not in the conversation between the supplied critic and candidate.' USING HINT = 'MESSAGE_NOT_IN_CONVERSATION';
      END IF;

      /* A user can only read a system message or a message from the match */
      IF NEW.candidate_user_id <> _sender_user_id THEN
        RAISE EXCEPTION 'Only a message from a match can be read by the user' USING HINT = 'CANNOT_READ_SENT_MESSAGE';
      END IF;

      /* If the message can be read, the timestamp must be 1) after the current read timestamp */
      /* and 2) after the timestamp of the message */
      IF _timestamp > NEW.critic_read_message_timestamp THEN
        RAISE EXCEPTION 'The read receipt for a message must be after the message was sent.' USING HINT = 'READ_TIMESTAMP_BEFORE_MESSAGE_TIMESTAMP';
      END IF;

      /* If this is a not a new relationship, then we must perform additional checks */
      /* These checks only neeed to be performed if there is already a read receipt */
      IF TG_OP = 'UPDATE' AND OLD.critic_read_message_id IS NOT NULL THEN
        IF NEW.critic_read_message_id = OLD.critic_read_message_id THEN
          RAISE EXCEPTION 'Cannot read the same message twice.' USING HINT = 'ALREADY_READ_MESSAGE';
        END IF;

        IF NEW.critic_read_message_timestamp <= OLD.critic_read_message_timestamp THEN
          RAISE EXCEPTION 'The new read timestamp must be after the old read timestamp' USING HINT = 'NEW_TIMESTAMP_BEFORE_OLD_TIMESTAMP';
        END IF;

        SELECT timestamp INTO _last_read_message_timestamp
        FROM messages
        WHERE id = OLD.critic_read_message_id;

        IF _last_read_message_timestamp > _timestamp THEN
          RAISE EXCEPTION 'Can only read messages that were sent after the currently read message.' USING HINT = 'GIVEN_MESSAGE_BEFORE_CURRENTLY_READ_MESSAGE';
        END IF;
      END IF;

      /* If no exceptions were raised, proceed with the insertion! */
      RETURN NEW;
    END
  `);
};

exports.down = (pgm) => {
  pgm.dropTrigger('relationships', 'read_receipt_constraint', {
    cascade: true,
    ifExists: true,
  });
  pgm.dropFunction('read_receipt_constraint', []);
  pgm.dropConstraint('relationships', 'read_message_id_and_timestamp_both_null_or_exist');
  pgm.dropColumns('relationships', ['critic_read_message_timestamp', 'critic_read_message_id']);
};
