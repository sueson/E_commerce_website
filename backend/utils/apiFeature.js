//Search filter... eg:(if we search wrist it should return the data which is releated to wrist.)
class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    search(){
        let keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : 'i'
            }
        } : {}
        this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};
        //before
        console.log(queryStrCopy);
        
        //removing fields from query  /api/v1/products?price[lt]=200&price[gt]=100
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]); //it will remove the names inside list and return only category..

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`); //for adding $ sign to less than and greater than
        console.log(queryStr);  //use to return the price filter which is greater than and less than

        //after
        console.log(queryStrCopy);

        this.query.find(JSON.parse(queryStr)); //parse will make the mongodb to filter the price, mongodb will not filter string...
        return this;
    }
    // api/v1/products?page=1 or page=1
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);  //calculate the no of data want to be load in one page....
        this.query.limit(resPerPage).skip(skip);
        return this;    //It is used for loading no.of data in per page....
    }

}

module.exports = ApiFeatures;