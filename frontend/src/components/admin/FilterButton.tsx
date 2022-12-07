import React from 'react';
import AdminButton from './AdminButton';

const FilterButton = ({ filterValue, resetFilter, isFilterDisabled }:
    { filterValue: string, resetFilter: React.MouseEventHandler<HTMLButtonElement>, isFilterDisabled: boolean }) => {
    return (
        <AdminButton disabled={isFilterDisabled} onClick={resetFilter}>
            {filterValue}
        </AdminButton>
    );
};

export default FilterButton;