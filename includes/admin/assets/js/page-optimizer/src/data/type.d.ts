declare class PageOptimizerData {
    data: any | null;

    constructor();

    analyze(url: string): Promise<any>;
}

export default PageOptimizerData;