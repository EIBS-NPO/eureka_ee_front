
import React, { useState, useEffect } from 'react';
import {Image, Item, Label} from "semantic-ui-react";
import ImageUpload from "./ImageUpload";

//si l'entité est nouvelle, on peut faire en sorte de stocker l'image cropée dans l'entité et faire gérer la convertion par un service vers le blob
const PictureForm = ({ entityType, entity, setter, isCircular = false}) => {

    const srcImgToBlob = (blob) => {
        return  URL.createObjectURL(blob);
    }

    return (
        <Item>
            <Item.Group divided>
                <Item>
                    <Item.Content>
                        {/*<Label attached='top'>
                            <h4>Picture</h4>
                        </Label>*/}
                        <Item.Description text-align="center">
                            {entity && entity.picture?
                                entity.picture instanceof Blob  ?
                                        <Image src={srcImgToBlob(entity.picture)} size='small' centered circular={isCircular}/>
                                        :
                                        <Image src={`data:image/jpeg;base64,${entity.picture}`} size='small' centered circular={isCircular}/>
                                :
                                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small'
                                       centered circular={isCircular}/>
                            }
                            <ImageUpload
                                setter={setter}
                                type={entityType}
                                entity={entity}
                            />
                        </Item.Description>
                    </Item.Content>
                {/*</Item>
                <Item>*/}

                </Item>
            </Item.Group>
        </Item>
    );
}


export default PictureForm;