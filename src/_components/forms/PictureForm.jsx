
import React, { useState, useEffect } from 'react';
import {Image, Item, Label} from "semantic-ui-react";
import ImageUpload from "../upload/ImageUpload";

//si l'entité est nouvelle, on peut faire en sorte de stocker l'image cropée dans l'entité et faire gérer la convertion par un service vers le blob
const PictureForm = ({ entityType, entity, setter}) => {

    const srcImgToBlob = (blob) => {
        return  URL.createObjectURL(blob);
    }

    return (
        <Item>
            <Item.Group divided>
                <Item>
                    <Item.Content>
                        <Label attached='top'>
                            <h4>Picture</h4>
                        </Label>
                        <Item.Description text-align="center">
                            {entity.picture?
                                entity.picture instanceof Blob  ?
                                        <Image src={srcImgToBlob(entity.picture)} size='small' centered />
                                        :
                                        <Image src={`data:image/jpeg;base64,${entity.picture}`} size='small' centered />
                                :
                                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small'
                                       centered/>
                            }
                        </Item.Description>
                    </Item.Content>
                </Item>
                <Item>
                    <ImageUpload
                        setter={setter}
                        type={entityType}
                        entity={entity}
                    />
                </Item>
            </Item.Group>
        </Item>
    );
}


export default PictureForm;