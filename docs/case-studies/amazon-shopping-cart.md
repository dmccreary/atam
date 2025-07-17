# Amazon Shopping Cart Failures

[See our graphic novel on this case study here](../stories/dynamodb/index.md)

The story of Amazon's struggles with their Oracle-based back-end system during the early 2000s, particularly around the busy holiday shopping season, is a significant one in the history of web-scale computing and database management. It highlights the challenges faced by rapidly growing online businesses and the innovative solutions they developed in response.

### The Problem

Around 2002, Amazon, which was rapidly growing, faced significant challenges with its Oracle relational database management system (RDBMS). The primary issues were related to scalability, reliability, and performance, especially during peak times like the holiday shopping season. The Oracle RDBMS, while robust and powerful, was not ideally suited to handle the massive, unpredictable spikes in traffic and transactions that Amazon experienced. This led to:

1.  **Slowdowns and Outages**: During peak traffic periods, the database struggled to keep up, resulting in slowdowns and outages.
2.  **Complexity and Cost**: Scaling up the Oracle database to meet the demand was complex and expensive.
3.  **Rigid Schema**: The relational model, with its rigid schema, was not flexible enough for Amazon's rapidly evolving and diverse data needs.

### Amazon's Response

Faced with these challenges, Amazon began to explore alternatives. Their response involved a fundamental shift in how they managed their data:

1.  **Distributed Systems**: Amazon moved away from a centralized RDBMS architecture to a distributed system. This approach allowed them to distribute the load across multiple nodes, improving performance and reliability.
2.  **Microservices Architecture**: They adopted a microservices architecture, breaking down their monolithic application into smaller, independent services. Each service could use the most appropriate data storage solution for its needs.
3.  **Custom Solutions**: Amazon started to build its own data storage solutions tailored to their specific requirements.

### Amazon DynamoDB

One of the most significant outcomes of Amazon's efforts to overcome the limitations of traditional RDBMS systems was the creation of Amazon DynamoDB. DynamoDB, introduced in 2012, is a fully managed NoSQL database service provided by Amazon Web Services (AWS). It was designed to address many of the issues that Amazon faced with their Oracle system:

1.  **Scalability**: DynamoDB can handle large amounts of traffic and data, scaling up or down as needed.
2.  **Performance**: It offers fast and predictable performance, even under massive load.
3.  **Flexibility**: Being a NoSQL database, it allows for more flexible data models, which is suitable for various types of applications and services.
4.  **Reliability and Availability**: DynamoDB provides high availability and durability, storing data across multiple AWS regions and Availability Zones.

In summary, Amazon's move from an Oracle RDBMS to building and eventually offering DynamoDB as a product was a response to the scalability and flexibility challenges they faced. It represents a broader trend in the industry towards distributed, NoSQL databases for web-scale applications.