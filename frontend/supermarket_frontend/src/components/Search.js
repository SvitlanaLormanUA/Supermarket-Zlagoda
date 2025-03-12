import React from 'react';

function Search() {
    return (
        <div className="shop-search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
            <img src="/assets/images/search.png" alt="Search" className="search-icon" />
            <style jsx>{`
                .shop-search-bar {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-bottom: 40px;
                    gap: 10px;
                    width: 100%;
                    max-width: 1000px;
                }

                .search-input {
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 15px;
                    font-size: 16px;
                    width: 200px;
                    outline: none;
                }

                .search-icon {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

export default Search;
