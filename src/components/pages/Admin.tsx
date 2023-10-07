import { Box } from "@mui/material"
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { chatRoomService } from "../../config/service-config"
import MessageType from "../../model/MessageType"

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'from', headerName: 'From', width: 90 },
    { field: 'to', headerName: 'To', width: 90 },
    { field: 'text', headerName: 'Text', width: 300 },
    { field: 'sendingDateTime', headerName: 'Sending time', width: 200, type: 'dateTime' }
]

const Admin: React.FC = () => {

    // const [accounts, setAccounts] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        // chatRoomService.getAllChats().then(group => {
        //     setAccounts(group.personal
        //         .filter((a: any) => !a.roles.includes("ADMIN"))
        //         .map((a: any, index: number) => { return { id: index, name: a._id } })
        //     )
        // })
        chatRoomService.getAllMessages().then((messages: MessageType[]) => {
            const n: any = messages.map(message => {
                return {
                    id: message._id,
                    from: message.from,
                    to: message.messageObj.to ? message.messageObj.to : message.messageObj.group,
                    sendingDateTime: new Date(message.sendingDateTime),
                    text: message.messageObj.text
                }
            })
            setMessages(n)
        })
    }, [])

    useEffect(() => {
        console.log(rowSelectionModel);
    }, [rowSelectionModel])

    return <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
            rows={messages}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
                console.log(newRowSelectionModel);

                setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}

        />
    </Box>
}

export default Admin