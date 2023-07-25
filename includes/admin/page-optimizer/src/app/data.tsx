// YourComponent.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { fetchData } from '../store/reducers/appReducer';
import { ThunkDispatch } from 'redux-thunk';
import { AppAction, AppState } from '../store/reducers/appReducer';

const YourComponent: React.FC = () => {
    const dispatch: ThunkDispatch<AppState, unknown, AppAction> = useDispatch();
    const { data, error } = useSelector((state: RootState) => state.app);

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    // Render your component using the fetched data
    // ...

    return (
        <div>
            {/* Display data from the API */}
        </div>
    );
};

export default YourComponent;
