import * as React from 'react'
import * as Dropzone from 'react-dropzone'
// import { CSSProperties } from 'react';

export interface UploadBoxProps {
  onFileRead: (fileName: string, binaryContents: string) => void
}
export interface UploadBoxState {
  accepted: File | null
  rejected: File | null
}
function conditionalFilesView(label: string, f: File | null) {
  if (f) {
    return (
      <div>
        <p><strong>{label}</strong></p>
        <ul>
          <li key={f.name}>{f.name} - {f.size} bytes</li>
        </ul>
      </div>
    )
  } else {
    return (
      <div />
    )
  }
}

export class UploadBox extends React.Component<UploadBoxProps, UploadBoxState> {

    constructor(props: UploadBoxProps) {
      super(props)
      this.state = {
        accepted: null,
        rejected: null
      }
      this.onDrop = this.onDrop.bind(this)
      this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
    }
    shouldComponentUpdate(nextProps: UploadBoxProps, nextState: UploadBoxState) {
        if ((nextState.accepted !== this.state.accepted)
        || (nextState.accepted !== this.state.accepted)) {
          return true
        }
        return false
    }
    onDrop(accepted: File[], rejected: File[]) {
      accepted.forEach(file => {
          const reader = new FileReader()
          reader.onload = () => {
              const fileAsBinaryString = reader.result
              // do whatever you want with the file content
              this.props.onFileRead(file.name, fileAsBinaryString)
          }
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
  
          reader.readAsBinaryString(file)
      })
      this.setState( { accepted: accepted[0], rejected: rejected[0] } )
    }
    render() {
      // console.log( 'render UploadBox '  )
      //const styleProp: CSSProperties = { width : '80%', height: '1.4em'}
      return (
        <section>
          <div className="dropzone">
            <Dropzone
              accept="application/pdf, image/png"
              onDrop={this.onDrop}
              className="fileUploadBox"
              activeClassName="fileUploadBox-active"
              rejectClassName="fileUploadBox-reject"
              multiple={false}
            >
              <p>Drop file here, or click to select file to upload. Only *.pdf will be accepted</p>
            </Dropzone>
          </div>
          <aside>
            {conditionalFilesView('Accepted file:', this.state.accepted)}
            {conditionalFilesView('Rejected file:', this.state.rejected)}
          </aside>
        </section>
      )
    }
  }
  