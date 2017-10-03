import * as React from 'react'
import { DropDownListComponent, DropDownList } from '@syncfusion/ej2-react-dropdowns'

export interface DropDownSfProps {
    onSelectionChange: (newVal: string) => void
    choices: string[]
    id: string
  }

export default class DropDownSf extends React.Component<DropDownSfProps, {}> {
    private myDropDown: DropDownList | null
    constructor() {
        super()
        this.onSelectionChange = this.onSelectionChange.bind(this)
        // this.onFiltering = this.onFiltering.bind(this)
    }
    
    // // filtering event handler to filter a country
    // onFiltering(args: FilteringEventArgs) {
    //     let query = new Query()
    //     //frame the query based on search string with filter type.
    //     query = (args.text != "") ? query.where("country", "startswith", args.text, true) : query
    //     //pass the filter data source, filter query to updateData method.
    //     args.updateData(this.searchData, query)
    // }

    onSelectionChange() {
        if (this.myDropDown != null) {
            this.props.onSelectionChange( this.myDropDown.value.toString() )
        }
    }
    render() {
        return (
             // specifies the tag for render the DropDownList component
            <DropDownListComponent 
                popupHeight="250px" 
                id={this.props.id}
                ref={(scope) => { this.myDropDown = scope }}
                allowFiltering={true} 
                dataSource={this.props.choices} 
                placeholder="Select an Option" 
                change={this.onSelectionChange}
            />
        )
    }
}