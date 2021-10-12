import {Input} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";

/**
 * @Author Thiery FAUCONNIER <th.fauconnier@outlook.fr>
 * @param elementList list of elements to philter
 * @param researchFields
 *      targeting filtration by element keys foundable on objects into elementList
 *      for element directly access put in a "main" object
 *      exemple:
 *      for filtering the elementList by a title, a creator's firstname/lastname and the city of the creator's address. my researchFields look like :
 *          {   main: ["title"],
 *              "creator: [
 *                      "firstname",
 *                      "lastname",
 *                      {address:
 *                          ["city"]
*                       }
 *             ]
 *     }
 * @param setResultList stack back the filtering results
 * @returns {JSX.Element}
 * @constructor
 */
const SearchInput = ({elementList, researchFields, setResultList}) => {

    /**
     * i18n translation
     */
    const { t } = useTranslation()

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    /**
     * returns a sub-object of an object from the list of items to filter
     * @param object an object of the elementList
     * @param subObjectName String of a subObject
     * @returns {undefined|unknown} return undefined if no found
     */
    function findSubObject (object, subObjectName) {
        for (const [elementKey, elementValue] of Object.entries(object)) {
            if (typeof elementValue === "object") {
                if (elementKey === subObjectName) {
                    return elementValue
                } else {
                    let deepObject = findSubObject(elementValue, subObjectName)
                    if(deepObject !== undefined) return deepObject
                }
            }
        }
        return undefined
    }

    /**
     * return a result for each attributeSearch
     * @param object
     * @param attributeTable
     * @param objectKey
     * @param result
     * @returns {boolean}
     */
    function checkByAttribute (object, attributeTable, objectKey =undefined, result = undefined ){
            if (!Array.isArray(attributeTable) && typeof attributeTable !== "object") { //if attribute
                console.log(objectKey + ":" + attributeTable)
                return searchInObject(object, objectKey, attributeTable)
            } else if ((typeof attributeTable === "object")) { // else search deeper
                for (const [key, value] of Object.entries(attributeTable)) {
                    if (Array.isArray(value)) objectKey = key
                    if(checkByAttribute(object, value, objectKey, result)) return true
                }
            }
    }

    /**
     *
     * @param object
     * @param subTarget
     * @param keyword
     * @param isFinish
     * @param result
     * @returns {boolean|undefined}
     */
    function searchInObject (object, subTarget, keyword, isFinish = false, result = undefined) {
        if (!isFinish || result !== true) { //for trace back and stop treatment when found result

            let foundObject = (subTarget !== "main") ? findSubObject(object, subTarget) : object

            if(foundObject !== undefined){
                for (const [elementKey, elementValue] of Object.entries(foundObject)) {

                    if (!isFinish || result !== true) {
                        if (!(typeof elementValue === "object") || subTarget === "main") {
                            if (elementKey === keyword) { // if targeted attribute found
                                result = elementValue.toLowerCase().includes(search.toLowerCase())
                                isFinish = true //stop the treatment for this elementObject
                            }
                        }
                    }
                }
            }
        }
        return result === undefined ? false : result
    }

    useEffect( () => {
        let tab=[]
        elementList.map(object => {
            if(checkByAttribute(object, researchFields)){ //recursive check by Attribute
                tab.push(object)
            }
        })
        setResultList(tab)
    },[search])

    return (
        <Input
            name="search"
            value={ search }
            onChange={handleSearch}
            placeholder={  t('search') + "..."}
        />
    )
}

export default withTranslation()(SearchInput);