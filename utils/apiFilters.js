class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    //This filter can also be used to filter forexample salary greaterthan/gt 50thound etc... its usefull for all sort of filtering
    //console.log(this.queryStr);
    //this.query=> is representing Job.find()
    //this.queryStr => User Typing job term

    //To do more queries
    const queryCopy = { ...this.queryStr };

    //Removing field from the query
    //The reason why we remove these fields is b/c we don't have any field in model with these names.

    const removeFields = ["sort", "fields", "q", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);
    console.log(queryCopy);

    //Advance filter using : lt, lte, gt, gte
    //we have to convert the queryStr to string as it's in model, once we have the string then replace/add dollar infront it with ${match}
    // so that we get result like {"salary":{"$gt":"50000"}}
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //Sort method

  sort() {
    if (this.queryStr.sort) {
      //To sort by multiple constraints
      const sortBy = this.queryStr.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //If user does not type anything to sort, then the jobs sorted based on their published date/time, -minus, is to show the latest job first
      this.query = this.query.sort("-postingDate");
    }
    return this;
  }
  //Limit Fields
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); //This will remove __v w/c is generated by mongodb by default, so we don't show it
    }
    return this;
  }
  searchByQuery() {
    if (this.queryStr.q) {
      const qu = this.queryStr.q.split("-").join(" "); //Replace - with " "
      this.query = this.query.find({ $text: { $search: '"' + qu + '"' } });
    }
    return this;
  }
  pagination() {
    const page = parseInt(this.queryStr.page, 10) || 1; //convert to number with base 10 decimal, if no page number selected by user default is 1
    const limit = parseInt(this.queryStr.limit, 10) || 10; //10 results/jobs per page by default if users dont specify
    const skipResults = (page - 1) * limit; //User may prefer to see from page number 2, so we skip from 1-10,
    // so users will see from 11-20 in the second page meaning they skip from 1-10
    //e.g {{DOMAIN}}/api/v1/jobs?limit=20page=5
    //5-1 => 4 * 20 => 80, user will scape 80 jobs and will see from 81 to 100
    this.query = this.query.skip(skipResults).limit(limit);

    return this;
  }
}

module.exports = APIFilters;
