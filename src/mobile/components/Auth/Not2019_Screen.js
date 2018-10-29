import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import { styles } from '../../styles/auth';

type Props = {
    year: any,
}

type State = {
    utln: string,
    email: string,
}

class Not2019Screen extends React.Component<Props, State> {
    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={styles.title}>PROJECT GEM</Text>
            </View>
            <div>"Suckers! Your year " + this.props.year + 
                "is not allowed to use Project GEM."</div>
             
        );
    }
}

export default Not2019Screen;