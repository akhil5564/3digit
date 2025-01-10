import React from 'react';

interface ReportProps {
    dataList: any[];
}

const Report: React.FC<ReportProps> = ({ dataList }) => {
    return (
        <div className="report">
            <h3>Report</h3>
            {/* Display the list of entered data in a table */}
            {dataList.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Count</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((data, index) => (
                            <tr key={index}>
                                <td>{data.number}</td>
                                <td>{data.count}</td>
                                <td>{data.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Report;
