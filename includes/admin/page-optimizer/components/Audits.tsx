import Card from "@/components/parts/card";
import Audit from "@/components/parts/Audit";

interface AuditsProps {
    audits: Audit[],
    activeTab: AuditTypes,
    tableData?: any[];
}

const Audits = ({ audits, activeTab, tableData }: AuditsProps) => {

    const filtered_audits = audits.filter(audit => {
        return audit.tags.includes(activeTab)
    })

    return (
        <div className='grid grid-cols-12 gap-6 w-full relative'>
            <div className='col-span-12 ml-16 flex flex-col gap-6'>
                {filtered_audits?.map(audit => <Audit key={audit.name} audit={audit} tableData={tableData}/> )}

            </div>

        </div>
    )

}

export default Audits
