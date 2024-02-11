class Apifeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword= this.queryStr.keyword ? { // keyword is going to use for search opeation
            name: {
                $regex:this.queryStr.keyword,
                $options:"i", //caseinsensative
            },
        }:{};
        //console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const queryCopy = {...this.queryStr}; //now it's copy is made if i won't use ... operator then the orginal value get changed

        //remove some fields for category
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach((key)=>delete queryCopy[key]); 

        //Filter for price and rating
        //console.log(queryCopy);
        let queryStr = JSON.stringify(queryCopy);//to convert in object into string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`) //gt = greater than , gte = greater than equal to , lt = less than , lte = less than equal to

        this.query = this.query.find(JSON.parse(queryStr));
        //console.log(queryStr);
        return this;
    }

    pagination(resultPerpage){
        const currentPage = Number(this.queryStr.page) || 1; 

        const skip = resultPerpage * (currentPage-1); // this i made to skip the pages
        this.query = this.query.limit(resultPerpage).skip(skip); //limit is used to restrict how many object can be seen in one page

        return this; 
    }
}

module.exports = Apifeatures 