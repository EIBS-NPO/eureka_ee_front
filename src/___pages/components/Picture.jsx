
import React from "react";
import {Item} from "semantic-ui-react";

const Picture = ( { size, picture, isFloat=null, isLink = false, linkTo = null} ) => {

    return (
        <Item>
            {picture ?
                <Item.Image
                    size = {size}
                    src ={`data:image/jpeg;base64,${ picture }`}
                    floated = {isFloat}
                    as = {isLink? "a" : ""}
                    href = {isLink? linkTo : ""}
                />
            :
                <Item.Image
                    size = {size}
                    src = 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                    floated = {isFloat}
                />
            }
        </Item>
    )
}

export default Picture;