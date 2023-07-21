export {};

declare global {
    interface Window {
        rapidload: any; // You can replace `any` with the type you want `rapidload` to be.
        PageOptimizerData: any
    }
}
