import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "components/ui/alert-dialog";
import {ReactNode} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import useSubmitSettings from "hooks/useSubmitSettings";


interface Props {
    children: ReactNode
    onClick: () => void
}

const UnsavedChanges = ({children , onClick }: Props) => {

    const { touched, fresh } = useSelector(optimizerData)
    const { submitSettings } = useSubmitSettings()

    if (!(fresh ? true : touched)) {
        return <div onClick={e => onClick()} >
            {children}
        </div>
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div>
                    {children}
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <div>
                   <AlertDialogHeader>
                       <AlertDialogTitle>Continue without Saving?</AlertDialogTitle>
                       <AlertDialogDescription>
                           <div>
                               You have changes that haven't been saved. If you leave or re-analyze now, your edits will be lost.
                           </div>
                       </AlertDialogDescription>
                   </AlertDialogHeader>
                   <AlertDialogFooter>
                       <AlertDialogAction onClick={async e => {
                           await submitSettings();

                           setTimeout(() => {
                               onClick();
                           }, 800)

                       }}>Save & Exit</AlertDialogAction>
                       <AlertDialogCancel>Discard</AlertDialogCancel>
                   </AlertDialogFooter>
               </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default UnsavedChanges