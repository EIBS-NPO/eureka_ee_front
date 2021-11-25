
export const getSearchOptionFor = (searchFor, translator) => {

    switch(searchFor){
        case "user":
            return [
                { key: 1 , text: translator('select_option_for_load_users'), value: 'select_option_for_load_users'},
                { key: 2, text: translator('all'), value: 'all' },
                { key: 3, text: translator('search'), value: 'search' },
                { key: 4, text: translator('unConfirmed'), value: 'unConfirmed' },
                { key: 5, text: translator('disabled'), value: "disabled" },
            ]
        case "org":
            return [
                { key: 1 , text: translator('select_option_for_load_orgs'), value: 'select_option_for_load_orgs'},
                { key: 2, text: translator('all'), value: 'all' },
                { key: 3, text: translator('search'), value: 'search' }
            ]
        case "project":
            return [
                { key: 1 , text: translator('select_option_for_load_projects'), value: 'select_option_for_load_projects'},
                { key: 2, text: translator('all'), value: 'all' },
                { key: 3, text: translator('search'), value: 'search' }
            ]
        case "activity":
            return [
                { key: 1 , text: translator('select_option_for_load_activities'), value: 'select_option_for_load_activities'},
                { key: 2, text: translator('all'), value: 'all' },
                { key: 3, text: translator('search'), value: 'search' }
            ]
    }
}

