import * as React from 'react'
import * as Dropzone from 'react-dropzone'

export interface UploadBoxProps {
  onFileRead: (fileName: string, binaryContents: string) => void
}
export interface UploadBoxState {
  accepted: File[]
  rejected: File[]
}
function ErrorFilesView(rejected: File[]) {
  if (rejected.length > 0) {
    return (
      <div>
        <h2>Rejected files</h2>
        <ul>
          {rejected.map((f: File) => <li key={f.name}>{f.name} - {f.size} bytes</li>)}
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
        accepted: [],
        rejected: []
      }
      this.onDrop = this.onDrop.bind(this)
      console.log( 'constructor UploadBox '  )
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
    }
    render() {
      console.log( 'render UploadBox '  )
      console.log(this.state)
      return (
        <section>
          <div className="dropzone">
            <Dropzone
              accept="application/pdf, image/png"
              onDrop={this.onDrop}
            >
              <p>Drop files here, or click to select files to upload. Only *.pdf will be accepted</p>
            </Dropzone>
          </div>
          <aside>
            <h4>Accepted files</h4>
            <ul>
              {this.state.accepted.map((f: File) => <li key={f.name}>{f.name} - {f.size} bytes</li>)}
            </ul>
            {ErrorFilesView(this.state.rejected)}
          </aside>
        </section>
      )
    }
  }
  