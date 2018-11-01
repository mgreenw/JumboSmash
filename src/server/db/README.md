# Current Database Schema

This should be updated whenever a migration is made.

```
create table users
(
	id serial not null constraint users_pkey1 primary key,
	utln citext not null constraint users_utln_key unique,
	email citext not null constraint users_email_key unique,
	successful_logins integer default 1 not null,
	want_he boolean default false not null,
	want_she boolean default false not null,
	want_they boolean default false not null,
	use_he boolean default false not null,
	use_she boolean default false not null,
	use_they boolean default false not null
);
```

```
create table profiles
(
	id serial not null constraint users_pkey primary key,
	display_name varchar(100) not null,
	user_id integer not null constraint profiles_user_key unique constraint profiles_user_fkey references users 	on delete cascade,
	birthday date not null,
	image1_url text not null,
	image2_url text,
	image3_url text,
	image4_url text,
	bio text default ''::text not null
);
```

```
create table verification_codes
(
	id serial not null constraint verification_codes_pkey primary key,
	utln citext not null constraint verification_codes_utln_key unique,
	code varchar(6) not null,
	expiration timestamp with time zone default CURRENT_TIMESTAMP not null,
	attempts integer default 0 not null,
	email_sends integer default 1 not null,
	last_email_send timestamp with time zone default CURRENT_TIMESTAMP not null,
	email citext default ''::character varying not null
);
```

```
create table relationships
(
	critic_user_id integer not null constraint relationships_critic_user_id_fkey references profiles 	on delete cascade,
	candidate_user_id integer not null constraint relationships_candidate_user_id_fkey references profiles 	on delete cascade,
	liked boolean default false not null,
	blocked boolean default false not null,
	last_swipe_timestamp timestamp with time zone not null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	constraint pk_critic_candidate primary key (critic_user_id, candidate_user_id)
);
```

