import {
    Pass,
    Fail,
    Average,
} from '../icons/icon-svg';


interface IconProps {
   icon: string;
}

const PerformanceIcons = ({ icon }: IconProps) => {
    return (
        <span >
            {icon === 'pass' ? (
                <Pass />
            ) : icon === 'average' ? (
                <Average />
            ) :icon === 'fail' ? (
                <Fail />
            ) : null}
        </span>
    );
};

export default PerformanceIcons;