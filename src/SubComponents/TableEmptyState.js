import React from "react";

export const TableEmptyState = ({
    message,
    colSpan = 1,
    className = "",
    hideHeader = false
}) => {
    return (
        <>
            {hideHeader ? (
                <table className="plc-min-w-full">
                    <tbody>
                        <tr>
                            <td
                                colSpan={colSpan}
                                className={`plc-py-8 plc-text-center plc-text-gray-500 ${className}`}
                            >
                                {message}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <tbody>
                    <tr>
                        <td
                            colSpan={colSpan}
                            className={`plc-py-8 plc-text-center plc-text-gray-500 ${className}`}
                        >
                            {message}
                        </td>
                    </tr>
                </tbody>
            )}
        </>
    );
}; 