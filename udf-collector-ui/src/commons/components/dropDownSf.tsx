import * as React from 'react'
import { DropDownListComponent, DropDownList } from '@syncfusion/ej2-react-dropdowns'
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns'
import { Query } from '@syncfusion/ej2-data'

export interface DropDownSfProps {
    onSelectionChange: (newVal: string) => void
    choices: string[]
    id: string
    currVal: string
  }

export class DropDownSf extends React.Component<DropDownSfProps, {}> {
    private myDropDown: DropDownList | null
    private fields: object = { text: "index", value: "descr" };
    // private choicesData: { [key: string]: Object; }[] = []

    constructor() {
        super()
        this.onSelectionChange = this.onSelectionChange.bind(this)
        // this.choicesData = 
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
        const choicesData: { [key: string]: Object; }[] = 
            this.props.choices.map((item) => { return { index: item, descr: item } } )
        return (
             // specifies the tag for render the DropDownList component
            <DropDownListComponent 
                popupHeight="250px" 
                id={this.props.id}
                ref={(scope) => { this.myDropDown = scope }}
                allowFiltering={true}
                fields={this.fields}
                value={this.props.currVal}
                dataSource={choicesData} 
                placeholder="Select an Option" 
                change={this.onSelectionChange}
            />
        )
    }
}

export class SampleFilterDrop extends React.Component<{}, {}> {
    // define the filtering data
    private searchData = [ 'California', 'Georgia' , 'Florida'] 
    // { [key: string]: Object; }[] = [
    //     { index: 's1', country: 'Alaska' }, { index: 's2', country: 'California' },
    //     { index: 's3', country: 'Florida' }, { index: 's4', country: 'Georgia' }
    // ]
    // maps the appropriate column to fields property
    // private fields: object = { text: 'country', value: 'index' }
    constructor() {
        super()
        this.onFiltering = this.onFiltering.bind(this)
    }
    // filtering event handler to filter a country
    onFiltering(args: FilteringEventArgs) {
        let query = new Query()
        // frame the query based on search string with filter type.
        query = (args.text !== '') ? query.where('country', 'startswith', args.text, true) : query
        // pass the filter data source, filter query to updateData method.
        args.updateData(this.searchData, query)
    }

    // NOTE, with fitlering, we need a kay value pair
    render() {
        return (
             // specifies the tag for render the DropDownList component
            <DropDownListComponent 
                id="ddlelement" 
                popupHeight="250px" 
                
                dataSource={this.searchData} 
                placeholder="Select a country" 
            />
        )
    }
}