// ==UserScript==
// @name         Google Time Filter Always Visible
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a time filter menu to Google search results with an 'hour' option
// @author       You
// @match        *://*google.*/*search?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const timeFrames = ['all', 'hour', 'day', 'week', 'month', 'year'];
    const redditOptions = ['Standard', 'Reddit'];

    // Adds or updates the time filter in the Google search query
    function addTimeFilter(timeFrame) {
        const searchBox = document.querySelector('input[name="q"]');
        if (searchBox) {
            // Remove existing time filter from the query if present
            searchBox.value = searchBox.value.replace(/ after:\d{4}-\d{2}-\d{2}/g, '');

            if (timeFrame === 'all') {
                // If 'all' is selected, simply refresh the results without a time filter
                searchBox.form.submit();
            } else {
                let date = new Date();
                switch (timeFrame) {
                    case 'hour':
                        date.setHours(date.getHours() - 1);
                        break;
                    case 'day':
                        date.setDate(date.getDate() - 1);
                        break;
                    case 'week':
                        date.setDate(date.getDate() - 7);
                        break;
                    case 'month':
                        date.setMonth(date.getMonth() - 1);
                        break;
                    case 'year':
                        date.setFullYear(date.getFullYear() - 1);
                        break;
                }

                const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                searchBox.value += ` after:${dateString}`;
                searchBox.form.submit(); // Submit the search form to refresh the results
            }
        }
    }

    // Create and insert the time filter menu
    function createTimeFilterMenu() {
        const timeFilterMenu = document.createElement('div');
        timeFilterMenu.id = 'time-filter-menu';
        timeFilterMenu.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            z-index: 1000;
            text-align: center;
        `;

        timeFrames.forEach(function(timeFrame) {
            const filterButton = document.createElement('button');
            filterButton.textContent = timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1);
            filterButton.style.cssText = `
                display: block;
                margin: 5px 0;
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background-color: #d3d3d3; /* Darker grey for better visibility */
                color: #333;
                cursor: pointer;
                outline: none;
                font-size: 1em;
                transition: background-color 0.3s, color 0.3s;
            `;
            filterButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#bdbdbd'; /* Even darker on hover */
                this.style.color = '#222';
            });
            filterButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#d3d3d3'; /* Revert to darker grey */
                this.style.color = '#333';
            });
            filterButton.addEventListener('click', function() { addTimeFilter(timeFrame) });
            timeFilterMenu.appendChild(filterButton);
        });

        document.body.appendChild(timeFilterMenu);
    }

    createTimeFilterMenu();
})();
