import { useCallback, useEffect, useState } from "react";

const usePerformanceColors = (performance?: number, loading?: boolean = false) => {

    const [performanceIcon, setPerformanceIcon] = useState('fail');
    const [progressbarColor, setProgressbarColor] = useState('transparent');
    const [progressbarBg, setProgressbarBg] = useState('transparent');

    const progressBarColorCode = useCallback<any>((_perf = null) => {
        const bgOpacity = 0.08
        const _performance = _perf ? _perf : performance
        const _loading = loading



        if (_loading) {
            setProgressbarColor('#e4e4e7');
            setProgressbarBg('transparent');
            setPerformanceIcon('average')
            return;
        }

        if (!_performance || _performance < 50) {
            setProgressbarColor('#ff4e43');
            setProgressbarBg(`rgb(255, 51, 51, ${bgOpacity} )`);
            setPerformanceIcon('fail')
        } else if (_performance < 90) {
            setProgressbarColor('#FFAA33');
            setProgressbarBg(`rgb(255, 170, 51, ${bgOpacity})`);
            setPerformanceIcon('average')
        } else if (_performance < 101) {
            setProgressbarColor('#09B42F');
            setProgressbarBg(`rgb(9, 180, 4, ${bgOpacity})`);
            setPerformanceIcon('pass')
        }

        return [performanceIcon, progressbarColor, progressbarBg]
    }, [performance]);

    useEffect(() => {
        progressBarColorCode()
    }, [])

    useEffect(() => {
        progressBarColorCode()
    }, [performance, loading])

    return [performanceIcon, progressbarColor, progressbarBg, progressBarColorCode]
}

export default usePerformanceColors