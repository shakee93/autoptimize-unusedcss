import ThemeSwitcher from "components/ui/theme-switcher";
import Button from "components/ui/button";
import {Redo2, SaveIcon, Undo2} from "lucide-react";
import {useOptimizerContext} from "../../../context/root";
import TooltipText from "components/ui/tooltip-text";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import React, {useState, MouseEvent} from "react";
import {cn} from "lib/utils";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar";
import {fetchData} from "../../../store/app/appActions";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import axios from "axios";

interface FooterProps {
    url: string,
    togglePerformance: boolean
}

const Footer = ({ url, togglePerformance } : FooterProps) => {

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { setShowOptimizer, options } = useOptimizerContext()
    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const { settings, data, loading } = useSelector( optimizerData)
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const submitSettings = async (e: MouseEvent<HTMLButtonElement>) => {
        // access the updated data and settings from the store
        // console.log(data, settings);
        // console.log(data)

        let req_url = "";
        let query = '?action=optimizer_update_settings&nonce=' + options.nonce + '&url=' + url + '&strategy=' + activeReport;
        if (options?.ajax_url) {
            req_url = options.ajax_url + query;
        } else {
            req_url = "http://rapidload.local/wp-admin/admin-ajax.php" + query;
        }


        // let datax = await axios.post(req_url, data);

        // fetch(req_url, {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        // })
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         console.log(responseData);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });

        fetch(req_url, {
            "body": JSON.stringify(data),
            "method": "POST",
            // "mode": "no-cors",
            "credentials": "omit"
        });

    }

    if (loading) {
        return  <></>
    }

    return (
        <footer className='fixed flex items-center justify-between left-0 bottom-0 px-6 py-2 dark:bg-zinc-800/90 bg-zinc-50 border-t dark:border-zinc-600 border-zinc-300 w-full'>
           <div className='flex gap-4 items-center'>

              <a target="_blank" href={url} className='flex flex-row gap-3 items-center'>
                  {togglePerformance ? (
                      <div className={cn(
                          'h-fit w-fit bg-zinc-200 flex items-center justify-center rounded-md',
                          isFaviconLoaded ? 'flex' : 'hidden'
                      )
                      }>
                          <img onLoad={e => setIsFaviconLoaded(true)} className='w-[2.1rem] min-h-[2rem] rounded p-1 bg-zinc-200/70' src={`https://www.google.com/s2/favicons?domain=${url}&sz=128`} alt=""/>
                      </div>
                  ) : (
                      <div className='px-[0.3rem]'>
                          <div className='w-6'>
                              <CircularProgressbarWithChildren styles={buildStyles({
                                  pathColor: '#0bb42f'
                              })} value={data?.data.performance ? data.data.performance : 0} strokeWidth={12}>
                                  <span className='text-xxs text-zinc-500'> {data?.data.performance ? data.data.performance : 0}</span>
                              </CircularProgressbarWithChildren>
                          </div>
                      </div>
                  )}
                  <div>
                      <span className='flex text-sm gap-1.5 items-center' >
                          {url} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </span>
                      <div className='text-xxs leading-relaxed text-zinc-500'>Last Analyzed 2 days ago...</div>
                  </div>
            </a>

           </div>
            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-zinc-200'>
                    <TooltipText text='Switch theme'>
                        <ThemeSwitcher></ThemeSwitcher>
                    </TooltipText>
                    <TooltipText text='Undo'>
                        <Undo2 className='w-5' />
                    </TooltipText>
                    <TooltipText text='Redo'>
                        <Redo2 className='w-5' />
                    </TooltipText>

                </div>
                <Button onClick={e => submitSettings(e)} className='text-sm'><SaveIcon className='w-5'/> Save Changes</Button>
                <Button className='text-sm' onClick={ e => setShowOptimizer(false)} dark={false}>Close</Button>
            </div>
        </footer>
    );
}

export default Footer