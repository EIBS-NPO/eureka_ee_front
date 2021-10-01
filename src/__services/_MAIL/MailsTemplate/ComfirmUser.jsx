import React from 'react';
import { Email, Item, A} from 'react-html-email';
import { LOCAL_URL } from "../../../config";

export default function InlineLink({name, children}) {
    return (
        <Email title='link'>
            <Item>
                Hello {name}
                <a href={LOCAL_URL + "/activation"}>clic here to activate your account</a>
             {/*   <A style={{ paddingLeft: 10 }}  href='/blog/'>Click me!</A>*/}
            </Item>
            <Item>
                {children}
            </Item>
        </Email>
    )};