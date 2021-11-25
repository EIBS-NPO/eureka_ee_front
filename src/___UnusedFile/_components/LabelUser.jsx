
import {Image, Label} from "semantic-ui-react";
import React from "react";
import {withTranslation} from "react-i18next";
import Picture from "../../_AppComponent/_CommonComponents/Picture";

const LabelUser = ({ user, type, t} ) => {

 //   console.log(user)
    return (
        <Label as='a' basic image>
           {/* {user.picture &&*/}
              {/*  <Picture size="small" picture={user.picture} isFloat={"left"}/>*/}
          {/*  }*/}
            {user.lastname + ' ' + user.firstname}

            {type === "referent" && <Label.Detail>{ t('referent') }</Label.Detail>}
            {type === "author" && <Label.Detail>{ t('author') }</Label.Detail>}

        </Label>
    )
}

export default withTranslation()(LabelUser);