
import React, { useState } from 'react';
import {Image, Item, Label} from "semantic-ui-react";
import ImageUpload from "../upload/ImageUpload";

const PictureForm = ({ entityType, entity}) => {

    const [picture, setPicture] = useState(entity.picture);

    return (
        <Item>
            <Item.Group divided>
                <Item>
                    <Item.Content>
                        <Label attached='top'>
                            <h4>Picture</h4>
                        </Label>
                        <Item.Description text-align="center">
                            {picture ?
                                <Image src={`data:image/jpeg;base64,${picture}`} size='small' centered />
                                :
                                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small'
                                       centered/>
                            }
                        </Item.Description>
                    </Item.Content>
                </Item>
                <Item>
                    <ImageUpload
                        setRefresh={setPicture}
                        type={entityType}
                        entity={entity}
                    />
                </Item>
            </Item.Group>
        </Item>
    );
}


export default PictureForm;