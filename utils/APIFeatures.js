class APIFeatures {
    constructor(URL, queryString) {
        this.URL = URL;
        this.queryString = queryString;
    }

    searchTerms() {
        try {
            const queryObj = {...this.queryString };
            const excludedFields = ["page", "sort", "limit", "fields"];
            excludedFields.forEach((el) => delete queryObj[el]);

            let collection = "";

            if (queryObj.collection) {
                collection =
                    "&q=" +
                    queryObj.collection +
                    "&items=true&suggestions=true&categories=true";
            }
            this.URL = this.URL + collection;
            return this;
        } catch (error) {
            console.log("ERROR FROM SEARCHTERMS CLASS🔥=>" + error);
        }
    }

    sort() {
        try {
            let sort = "";
            const sortParam = this.queryString.sort;

            if (sortParam != undefined) {
                if (sortParam === "price" || sortParam === "priced") {
                    //this is for descending
                    sort = "&sortBy=price&sortOrder=desc";
                } else if (sortParam === "pricea") {
                    sort = "&sortBy=price&sortOrder=asc";
                } else if (sortParam === "titlea") {
                    sort = "&sortBy=title&sortOrder=asc";
                } else if (sortParam === "titled") {
                    sort = "&sortBy=title&sortOrder=desc";
                } else if (sortParam === "relevance") {
                    sort = "&sortBy=relevance&sortOrder=desc";
                } else {
                    sort = "&sortBy=relevance&sortOrder=asc";
                }
            } else {
                sort = "";
            }
            this.URL = this.URL + sort;
            return this;
        } catch (error) {
            console.log("ERROR FROM SORT CLASS🔥=>" + error);
        }
    }

    paginate() {
        const startIndex = this.queryString.page * 1 || 1;
        const maxResults = this.queryString.limit * 1 || 10;

        const paginate =
            "&startIndex=" + startIndex + "&maxResults=" + maxResults + "&pages=true";

        //return (this.URL = this.URL + paginate);
        return this; // restrictBy[attribute]=value
        ///https://dd23c77b3c55.ngrok.io/dev/v1/product?collection=iphone11&sort=price%20a&facets=true&filter={price:%2210.0000,120000.0000%22,%22stock_status%22:%22In%20Stock%22}
    }
    filter() {
        let filter = "";
        let FilterParam = this.queryString.filter;
        let hasFilter = false;
        let from = 0;
        if (FilterParam || FilterParam != undefined) {
            try {
                FilterParam = JSON.parse(FilterParam);
                for (var key in FilterParam) {
                    FilterParam[key] = FilterParam[key].toString();
                    if (filter.length > 0) {
                        if (key === "from") {
                            filter = filter.concat(
                                "&restrictBy[price]=" + FilterParam[key] + ","
                            );
                            from = FilterParam[key];
                        } else if (key === "to") {
                            filter = filter.concat(
                                "&restrictBy[price]=" + from + "," + FilterParam[key]
                            );
                        } else {
                            FilterParam[key] = FilterParam[key].includes("&") ?
                                FilterParam[key].replace("&", "%26") :
                                FilterParam[key];
                            filter += "&restrictBy[" + key + "]=" + FilterParam[key];
                        }
                    } else {
                        if (key === "from") {
                            filter = filter.concat(
                                "&restrictBy[price]=" + FilterParam[key] + ","
                            );
                            from = FilterParam[key];
                        } else if (key === "to") {
                            filter = filter.concat(
                                "&restrictBy[price]=" + from + "," + FilterParam[key]
                            );
                        } else {
                            FilterParam[key] = FilterParam[key].includes("&") ?
                                FilterParam[key].replace("&", "%26") :
                                FilterParam[key];
                            filter += "&restrictBy[" + key + "]=" + FilterParam[key];
                        }
                    }
                }
            } catch (error) {
                console.log("ERROR FROM FILTER CLASS🔥=>" + error);
            }
            hasFilter = true;
        }
        this.URL = this.URL + filter;
        const result = [this.URL, hasFilter];
        return result;
    }
}
module.exports = APIFeatures;