
import React from "react";
import {Item} from "semantic-ui-react";


const Picture = ( { size, picture, isFloat=null} ) => {

   /* const [src, setSrc] = useState("")

    useEffect(()=> {
        if(entity.picture){
            setSrc(`data:image/jpeg;base64,${ entity.picture }`)
        }
        else {
            setSrc('https://react.semantic-ui.com/images/wireframe/square-image.png')
        }
    },[])*/

    return (
        <Item>
            {picture ?
                <Item.Image
                    size = {size}
                    src ={`data:image/jpeg;base64,${ picture }`}
                    floated = {isFloat}
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