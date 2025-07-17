# ATAM Glossary of Terms

#### ISO 11179 Term Definition

A term definition is considered to be consistent with ISO metadata registry guideline 11179 if it meets the following criteria:

1. Precise
2. Concise
3. Distinct
4. Non-circular
5. Unencumbered with business rules

#### ACID Properties

A set of properties that guarantee database transactions are processed reliably through atomicity, consistency, isolation, and durability.

**Example:** PostgreSQL provides ACID compliance for all transactions.

#### Anti-Entropy

A distributed system process that ensures data consistency by periodically comparing and synchronizing data across replicas.

**Example:** Cassandra uses anti-entropy repair to maintain consistency across cluster nodes.

#### API Gateway

A service that acts as an entry point for client requests, providing routing, authentication, and request/response transformation.

**Example:** Kong API Gateway manages traffic between microservices and external clients.

#### Architectural Approaches

Methods or strategies used to achieve desired quality attributes in a software system's architecture.

**Example:** Load balancing is an architectural approach for improving system availability.

#### Architectural Decisions

Fundamental choices made about the structure, behavior, and interaction of system components.

**Example:** Choosing between monolithic and microservices architecture is an architectural decision.

#### ATAM (Architecture Tradeoff Analysis Method)

A systematic approach for evaluating software architectures by analyzing how architectural decisions support quality attributes.

**Example:** ATAM helps identify risks and tradeoffs in a proposed microservices architecture.

#### Atomicity

A transaction property ensuring that all operations within a transaction are completed successfully or none are applied.

**Example:** A bank transfer either completes both debit and credit operations or neither.

#### Authentication

The process of verifying the identity of a user or system component.

**Example:** Multi-factor authentication requires both password and SMS verification.

#### Authorization

The process of determining what actions an authenticated user or system is permitted to perform.

**Example:** RBAC authorization grants different database access levels to users based on their roles.

#### Auto-Scaling

The automatic adjustment of computing resources based on current demand or predefined metrics.

**Example:** Kubernetes auto-scaling increases pod replicas when CPU usage exceeds 80%.

#### Auto-Sharding

The automatic partitioning of data across multiple database instances without manual intervention.

**Example:** MongoDB auto-sharding distributes collections across shards based on shard keys.

#### Availability

The degree to which a system is operational and accessible when required for use.

**Example:** 99.9% availability means the system is down for no more than 8.76 hours per year.

#### BASE Properties

A consistency model emphasizing basically available, soft state, and eventual consistency over strict ACID properties.

**Example:** NoSQL databases often implement BASE properties for better scalability.

#### Batch Processing

A method of processing data in large volumes at scheduled intervals rather than in real-time.

**Example:** Daily ETL jobs process transaction data from the previous day.

#### Bloom Filters

A probabilistic data structure used to test whether an element is in a set, with possible false positives but no false negatives.

**Example:** Cassandra uses Bloom filters to reduce disk reads during key lookups.

#### BSON (Binary JSON)

A binary representation of JSON documents that supports additional data types and enables efficient storage and parsing.

**Example:** MongoDB stores documents in BSON format for better performance than plain JSON.

#### B-Trees

A self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time.

**Example:** Most relational databases use B-trees for indexing table data.

#### Bulk Synchronous Parallel (BSP)

A parallel computing model where computation proceeds in synchronized supersteps.

**Example:** Apache Giraph implements BSP for distributed graph processing.

#### Business Drivers

The key business needs, goals, and constraints that influence architectural decisions.

**Example:** Reducing operational costs is a business driver for cloud migration.

#### Caching

The temporary storage of frequently accessed data in a faster storage layer to improve response times.

**Example:** Redis caches database query results to reduce database load.

#### CAP Theorem

A principle stating that distributed systems can guarantee at most two of consistency, availability, and partition tolerance.

**Example:** During network partitions, systems must choose between consistency and availability.

#### Cassandra Query Language (CQL)

A query language for Apache Cassandra that provides a SQL-like interface for interacting with Cassandra databases.

**Example:** CQL SELECT statements retrieve data from Cassandra column families.

#### Cell Timestamps

Metadata associated with individual data cells that indicates when the data was written or last modified.

**Example:** Cassandra uses cell timestamps for conflict resolution in distributed writes.

#### Cloud Computing

The delivery of computing services over the internet, including servers, storage, databases, and software.

**Example:** AWS provides cloud computing services through EC2 virtual machines.

#### Column Families

A data structure in column-family databases that groups related columns together.

**Example:** Cassandra organizes data into column families similar to tables in relational databases.

#### Column-Family Model

A data model that stores data in column families, where each row can have different columns.

**Example:** Apache HBase implements the column-family model for big data storage.

#### Column-Family Stores

Databases that organize data into column families, allowing flexible schemas and horizontal scaling.

**Example:** Cassandra and HBase are column-family stores designed for big data applications.

#### Columnar Compression

A data compression technique that compresses data column by column rather than row by row.

**Example:** Parquet files use columnar compression to reduce storage space for analytical queries.

#### Columnar Storage

A data storage method that stores data by columns rather than rows, optimizing for analytical queries.

**Example:** Amazon Redshift uses columnar storage for fast aggregation queries.

#### Community Detection

Graph algorithms that identify groups of nodes that are more densely connected to each other than to other nodes.

**Example:** Social networks use community detection to identify user groups with similar interests.

#### Compaction

A background process that merges and reorganizes data files to optimize storage and query performance.

**Example:** Cassandra compaction merges SSTables to eliminate deleted data and improve read performance.

#### Composite Keys

A primary key composed of multiple columns that together uniquely identify a row.

**Example:** A composite key might combine customer_id and order_date to uniquely identify orders.

#### Compound Indexes

Database indexes that include multiple columns to optimize queries with multiple search criteria.

**Example:** A compound index on (last_name, first_name) optimizes queries filtering by both fields.

#### Compression

The process of reducing data size through encoding techniques to save storage space and transfer time.

**Example:** LZ4 compression reduces the size of database backup files.

#### Conflict Resolution

Mechanisms for handling conflicting updates to the same data in distributed systems.

**Example:** Vector clocks provide conflict resolution for concurrent updates in distributed databases.

#### Consensus Algorithms

Distributed computing algorithms that enable nodes in a network to agree on a single value or decision.

**Example:** Raft consensus algorithm ensures consistency in distributed key-value stores.

#### Consistency

The property that all nodes in a distributed system see the same data at the same time.

**Example:** Strong consistency ensures that all reads return the most recent write.

#### Consistent Hashing

A distributed hashing scheme that minimizes data movement when nodes are added or removed.

**Example:** Cassandra uses consistent hashing to distribute data across cluster nodes.

#### Container Orchestration

The automated deployment, management, and scaling of containerized applications.

**Example:** Kubernetes orchestrates Docker containers across multiple hosts.

#### Content Delivery Networks (CDN)

A distributed network of servers that deliver web content to users based on their geographic location.

**Example:** CloudFlare CDN caches static content closer to users for faster page loads.

#### Cost-Based Optimization

A query optimization technique that selects execution plans based on estimated resource costs.

**Example:** PostgreSQL's cost-based optimizer chooses between index scans and table scans.

#### CQRS (Command Query Responsibility Segregation)

An architectural pattern that separates read and write operations to optimize performance and scalability.

**Example:** E-commerce systems use CQRS to separate order processing from product catalog queries.

#### Cypher

A declarative query language for graph databases, particularly Neo4j.

**Example:** Cypher queries use pattern matching to find relationships between nodes.

#### Data Governance

The management of data availability, usability, integrity, and security across an organization.

**Example:** Data governance policies define who can access customer personal information.

#### Data Ingestion

The process of collecting and importing data from various sources into a storage system.

**Example:** Apache Kafka ingests streaming data from IoT devices into a data lake.

#### Data Lakes

Large-scale storage repositories that hold raw data in its native format until needed.

**Example:** AWS S3 serves as a data lake for storing unstructured log files and documents.

#### Data Lineage

The tracking of data flow from its origin through various transformations to its final destination.

**Example:** Data lineage tools show how customer data flows from CRM to analytics dashboards.

#### Data Locality

The principle of storing and processing data close to where it's needed to minimize transfer costs.

**Example:** Hadoop moves computation to data nodes rather than moving data to computation nodes.

#### Data Marts

Specialized subsets of data warehouses focused on specific business areas or departments.

**Example:** A sales data mart contains only sales-related data for the sales team's analytics.

#### Data Masking

The process of hiding sensitive data by replacing it with realistic but fictional data.

**Example:** Production databases use data masking to protect customer SSNs in test environments.

#### Data Modeling

The process of creating a conceptual representation of data structures and their relationships.

**Example:** Entity-relationship modeling defines how customer and order entities relate.

#### Data Pipelines

Automated workflows that move and transform data from source systems to destination systems.

**Example:** ETL pipelines extract data from databases, transform it, and load it into data warehouses.

#### Data Privacy

The protection of personal and sensitive information from unauthorized access or disclosure.

**Example:** GDPR compliance requires explicit consent for processing personal data.

#### Data Quality

The degree to which data is accurate, complete, consistent, and fit for its intended use.

**Example:** Data quality checks validate that email addresses follow proper format rules.

#### Data Warehousing

The process of collecting, storing, and managing data from multiple sources for business intelligence.

**Example:** Snowflake provides cloud data warehousing for analytical workloads.

#### Denormalization

The process of adding redundant data to improve query performance at the cost of storage space.

**Example:** Storing customer names in order tables eliminates joins but increases storage.

#### Dimension Tables

Tables in a star schema that contain descriptive attributes for analyzing fact data.

**Example:** A time dimension table contains date, month, quarter, and year attributes.

#### Distributed Systems

Computing systems where components are located on different networked computers that communicate through message passing.

**Example:** Google's search engine runs on a distributed system across multiple data centers.

#### Distributed Transactions

Transactions that span multiple databases or systems while maintaining ACID properties.

**Example:** Two-phase commit ensures atomicity across multiple database systems.

#### Document Collections

Groups of related documents stored together in document databases.

**Example:** MongoDB collections store user profiles as JSON documents.

#### Document Databases

NoSQL databases that store data as documents, typically in JSON or XML format.

**Example:** MongoDB stores product catalogs as flexible JSON documents.

#### Document Model

A data model that stores information as documents containing nested attributes and arrays.

**Example:** JSON documents can store entire customer profiles with embedded address information.

#### Document Type Definition (DTD)

A markup language for defining the structure and legal elements of XML documents.

**Example:** DTD validates that XML documents contain required elements in correct order.

#### Drill-Down

The process of navigating from summary data to more detailed data in analytical systems.

**Example:** Drilling down from quarterly sales to monthly sales to daily sales.

#### Durability

The guarantee that once a transaction is committed, it will survive system failures.

**Example:** Write-ahead logging ensures durability by recording changes before applying them.

#### Dynamic Columns

Columns that can be added to rows at runtime without modifying the database schema.

**Example:** Cassandra allows adding new columns to existing rows without schema changes.

#### Edge Computing

A distributed computing paradigm that brings computation and data storage closer to data sources.

**Example:** IoT sensors process data at the edge before sending summaries to the cloud.

#### ELT (Extract, Load, Transform)

A data integration process that loads raw data first, then transforms it within the destination system.

**Example:** Modern data lakes use ELT to load raw data and transform it for specific analyses.

#### Embedded Documents

Documents stored within other documents, creating nested data structures.

**Example:** Customer documents embed address documents rather than referencing separate address records.

#### Encryption at Rest

The protection of stored data through cryptographic algorithms.

**Example:** Database files are encrypted at rest using AES-256 encryption.

#### Encryption in Transit

The protection of data while it's being transmitted between systems.

**Example:** HTTPS encrypts data in transit between web browsers and servers.

#### Entity-Relationship Model

A data modeling technique that represents entities and their relationships in a database.

**Example:** ER diagrams show how customer entities relate to order entities.

#### ETL (Extract, Transform, Load)

A data integration process that extracts data from sources, transforms it, and loads it into destinations.

**Example:** Nightly ETL jobs extract sales data, calculate metrics, and load results into reporting tables.

#### Event Sourcing

An architectural pattern that stores all changes to application state as a sequence of events.

**Example:** Banking systems use event sourcing to maintain an audit trail of all account transactions.

#### Eventual Consistency

A consistency model where the system will become consistent over time if no new updates are made.

**Example:** DNS updates eventually propagate to all servers worldwide.

#### Execution Plans

Detailed steps that database engines use to execute queries, including access methods and join strategies.

**Example:** Query execution plans show whether indexes are used for table scans.

#### Fact Tables

Tables in a star schema that contain quantitative measures for business analysis.

**Example:** Sales fact tables contain revenue, quantity, and cost measures.

#### Failover

The automatic switching to a backup system when the primary system fails.

**Example:** Database failover redirects traffic to standby servers during primary server outages.

#### Findability

The ease with which information can be located and retrieved from a system.

**Example:** Search functionality and clear navigation improve content findability.

#### Fitness for Purpose

The degree to which a system meets its intended use and requirements.

**Example:** A real-time trading system's fitness for purpose depends on low-latency performance.

#### FLWOR Expressions

XQuery expressions that use For, Let, Where, Order by, and Return clauses to query XML data.

**Example:** FLWOR expressions extract and sort product information from XML catalogs.

#### Foreign Keys

Database constraints that link rows in one table to rows in another table.

**Example:** Order tables use customer_id foreign keys to reference customer tables.

#### Full-Text Search

The capability to search for text within documents or database fields.

**Example:** Elasticsearch provides full-text search across document collections.

#### Geo-Distribution

The deployment of system components across multiple geographic locations.

**Example:** Global CDNs use geo-distribution to serve content from nearby edge locations.

#### Geospatial Indexes

Specialized indexes for efficiently querying location-based data.

**Example:** MongoDB geospatial indexes enable finding nearby restaurants within a radius.

#### Gossip Protocol

A communication protocol where nodes periodically exchange state information with randomly selected peers.

**Example:** Cassandra uses gossip protocol for cluster membership and failure detection.

#### Graph Algorithms

Computational methods for analyzing graph structures and relationships.

**Example:** PageRank algorithm determines the importance of web pages based on link structure.

#### Graph Databases

NoSQL databases designed to store and query data with complex relationships.

**Example:** Neo4j stores social network connections as graph nodes and relationships.

#### Graph Embeddings

Vector representations of graph nodes that capture their structural properties.

**Example:** Node2Vec creates embeddings for recommendation systems based on user interaction graphs.

#### Graph Model

A data model that represents data as nodes connected by edges or relationships.

**Example:** Social networks use graph models to represent friend connections.

#### Graph Neural Networks (GNNs)

Neural network architectures designed to operate on graph-structured data.

**Example:** GNNs predict protein functions based on molecular interaction graphs.

#### Graph Partitioning

The division of large graphs into smaller subgraphs for distributed processing.

**Example:** Graph partitioning enables parallel processing of social network analysis.

#### Graph Traversal

The process of visiting nodes and edges in a graph following specific patterns.

**Example:** Breadth-first traversal finds the shortest path between two nodes.

#### GraphSAGE

A graph neural network framework for generating node embeddings through sampling and aggregation.

**Example:** GraphSAGE learns user preferences from social network interaction patterns.

#### Gremlin

A graph traversal language for querying graph databases.

**Example:** Gremlin queries find mutual friends between users in a social network.

#### GSQL (Graph SQL)

A query language for graph databases that extends SQL with graph-specific operations.

**Example:** GSQL queries analyze fraud patterns in financial transaction graphs.

#### Hadoop

An open-source framework for distributed storage and processing of big data.

**Example:** Hadoop MapReduce processes terabytes of log data across cluster nodes.

#### HBase

A distributed, column-family NoSQL database built on top of Hadoop.

**Example:** HBase stores time-series data for real-time analytics applications.

#### Health Checks

Monitoring mechanisms that verify system components are functioning correctly.

**Example:** Load balancers use health checks to route traffic only to healthy servers.

#### Hierarchical Data

Data organized in a tree-like structure with parent-child relationships.

**Example:** File systems organize files and directories in hierarchical structures.

#### High Availability

The characteristic of a system that remains operational for extended periods.

**Example:** Database clusters provide high availability through redundant nodes.

#### Hinted Handoff

A mechanism where nodes temporarily store data intended for unavailable nodes.

**Example:** Cassandra uses hinted handoff to ensure data delivery after node recovery.

#### Horizontal Scaling

The practice of adding more servers to handle increased load.

**Example:** Web applications achieve horizontal scaling by adding more web server instances.

#### HTML (HyperText Markup Language)

A markup language used to create web pages and web applications.

**Example:** HTML forms collect user input for database storage.

#### Hypercubes

Multidimensional data structures used in OLAP systems for fast analytical queries.

**Example:** Sales hypercubes allow analysis across product, time, and region dimensions.

#### IaaS (Infrastructure as a Service)

Cloud computing services that provide virtualized computing resources over the internet.

**Example:** AWS EC2 provides IaaS through virtual machine instances.

#### Indexing

The creation of data structures that improve query performance by providing fast access paths.

**Example:** B-tree indexes on customer_id columns speed up customer lookups.

#### Infrastructure as Code

The practice of managing infrastructure through code rather than manual configuration.

**Example:** Terraform scripts define cloud infrastructure as version-controlled code.

#### Interoperability

The ability of different systems to work together and exchange information.

**Example:** RESTful APIs enable interoperability between different software systems.

#### IoT (Internet of Things)

A network of physical devices embedded with sensors and software for data collection and exchange.

**Example:** Smart thermostats collect temperature data and adjust settings automatically.

#### Isolation

The guarantee that concurrent transactions do not interfere with each other.

**Example:** Database isolation prevents one user's changes from affecting another user's transaction.

#### JSON (JavaScript Object Notation)

A lightweight data interchange format that is easy for humans to read and write.

**Example:** REST APIs commonly use JSON for request and response payloads.

#### JSON Schema

A specification for validating the structure and content of JSON documents.

**Example:** JSON Schema validates that API requests contain required fields.

#### Kafka

A distributed streaming platform for building real-time data pipelines and applications.

**Example:** Kafka processes millions of events per second for real-time analytics.

#### Key-Value Model

A data model that stores data as key-value pairs with unique keys.

**Example:** Redis uses the key-value model for caching session data.

#### Key-Value Stores

NoSQL databases that store data as collections of key-value pairs.

**Example:** Amazon DynamoDB stores user preferences as key-value pairs.

#### Kubernetes

An open-source container orchestration platform for automating deployment and management.

**Example:** Kubernetes automatically scales application pods based on resource usage.

#### Labeled Property Graph (LPG)

A graph model where nodes and edges can have labels and properties.

**Example:** Neo4j uses LPG to model complex relationships with rich metadata.

#### Load Balancing

The distribution of incoming requests across multiple servers to optimize performance.

**Example:** Application load balancers distribute web traffic across multiple web servers.

#### Logging

The systematic recording of events and messages for monitoring and debugging.

**Example:** Application logs record user actions for security auditing.

#### LSM Trees (Log-Structured Merge Trees)

A data structure optimized for high-volume sequential writes.

**Example:** Cassandra uses LSM trees for efficient handling of write-heavy workloads.

#### Machine Learning (ML)

The use of algorithms and statistical models to enable computers to improve performance through experience.

**Example:** ML algorithms analyze customer behavior to recommend products.

#### Maintainability

The ease with which a system can be modified to correct faults or improve performance.

**Example:** Modular code architecture improves maintainability by isolating changes.

#### MapReduce

A programming model for processing large datasets in parallel across distributed systems.

**Example:** MapReduce jobs analyze web server logs to identify popular pages.

#### Master-Master Replication

A replication setup where multiple nodes can accept writes and synchronize changes.

**Example:** MySQL master-master replication allows writes to multiple database servers.

#### Master-Slave Architecture

A distributed system design where one master node coordinates multiple slave nodes.

**Example:** Redis master-slave architecture replicates data from master to slave nodes.

#### Massively Parallel Processing (MPP)

A computing architecture that uses many processors to perform computations in parallel.

**Example:** Data warehouses use MPP to execute complex analytical queries quickly.

#### Materialized Views

Pre-computed query results stored as tables to improve query performance.

**Example:** Materialized views store aggregated sales data for faster reporting.

#### Memcached

A high-performance, distributed memory caching system.

**Example:** Memcached stores database query results in memory for faster access.

#### Microservices

An architectural pattern that structures applications as collections of loosely coupled services.

**Example:** E-commerce platforms use microservices for user management, inventory, and payments.

#### MongoDB

A document-oriented NoSQL database that stores data in flexible JSON documents.

**Example:** MongoDB stores product catalogs with varying attributes per product.

#### Monitoring

The continuous observation of system performance and behavior.

**Example:** Application monitoring alerts developers when response times exceed thresholds.

#### Multi-Data Center Deployment

The distribution of system components across multiple data centers for redundancy.

**Example:** Global applications deploy across multiple data centers for disaster recovery.

#### Multi-Tenant Architecture

A software architecture where a single instance serves multiple tenants or customers.

**Example:** SaaS applications use multi-tenant architecture to serve multiple organizations.

#### Multi-Version Concurrency Control (MVCC)

A concurrency control method that maintains multiple versions of data to avoid locking.

**Example:** PostgreSQL uses MVCC to allow concurrent reads and writes without blocking.

#### MySQL

An open-source relational database management system.

**Example:** MySQL powers many web applications with ACID-compliant transactions.

#### Native Parallel Graph (NPG)

A graph processing model designed for native parallel execution.

**Example:** TigerGraph implements NPG for real-time graph analytics.

#### Neo4j

A graph database management system designed for handling connected data.

**Example:** Neo4j analyzes social network connections to detect fraud patterns.

#### NFRs (Non-Functional Requirements)

Requirements that specify criteria for system operation rather than specific behaviors.

**Example:** NFRs include performance targets like "response time under 100ms."

#### Node2Vec

A machine learning algorithm that generates vector representations of graph nodes.

**Example:** Node2Vec creates embeddings for social network users based on connection patterns.

#### Nodes (Vertices)

Individual entities in a graph database that can store properties and connect to other nodes.

**Example:** User nodes in a social network contain profile information and friend connections.

#### Non-Risks

Architectural elements that do not pose threats to system quality attributes.

**Example:** Well-established libraries with proven track records are typically non-risks.

#### Normalization

The process of organizing database tables to reduce redundancy and improve data integrity.

**Example:** Third normal form eliminates transitive dependencies between columns.

#### NoSQL

Database systems that provide flexible schemas and horizontal scaling beyond traditional SQL databases.

**Example:** Document databases like MongoDB store JSON documents without fixed schemas.

#### Object-Relational Impedance Mismatch

The conceptual difference between object-oriented programming and relational databases.

**Example:** Object inheritance doesn't map directly to relational table structures.

#### OLAP (Online Analytical Processing)

A category of database processing focused on complex analytical queries.

**Example:** OLAP cubes enable fast analysis of sales data across multiple dimensions.

#### OLAP Cubes

Multidimensional data structures that enable fast analytical queries.

**Example:** Sales cubes allow quick analysis by product, region, and time period.

#### OLTP (Online Transaction Processing)

A category of database processing focused on transaction-oriented applications.

**Example:** OLTP systems handle credit card transactions in real-time.

#### Ontology

A formal representation of knowledge that defines concepts and relationships within a domain.

**Example:** Medical ontologies define relationships between diseases, symptoms, and treatments.

#### Optimistic Concurrency Control

A concurrency control method that assumes conflicts are rare and checks for conflicts at commit time.

**Example:** Version numbers detect conflicts when multiple users edit the same document.

#### Oracle Database

A commercial relational database management system.

**Example:** Oracle Database provides enterprise-grade features for mission-critical applications.

#### PageRank

A graph algorithm that measures the importance of nodes based on link structure.

**Example:** Google's PageRank algorithm ranks web pages based on incoming links.

#### PaaS (Platform as a Service)

Cloud computing services that provide a platform for developing and running applications.

**Example:** Heroku provides PaaS for deploying web applications without managing servers.

#### Partitioning

The division of large databases into smaller, more manageable pieces.

**Example:** Date-based partitioning splits tables by time periods for better performance.

#### Partitioning Strategies

Methods for dividing data across multiple storage units or servers.

**Example:** Hash partitioning distributes data evenly across database shards.

#### Peer-to-Peer Architecture

A distributed system design where nodes act as both clients and servers.

**Example:** BitTorrent uses peer-to-peer architecture for file sharing.

#### Performance

The degree to which a system accomplishes its functions within time and resource constraints.

**Example:** Database performance measures include query response time and throughput.

#### Pessimistic Concurrency Control

A concurrency control method that prevents conflicts by locking resources before use.

**Example:** Database row locking prevents concurrent updates to the same record.

#### Pivot

The operation of rotating data from rows to columns for analysis.

**Example:** Pivot tables transform monthly sales data into columns for yearly comparison.

#### Point-in-Time Recovery

The ability to restore a database to a specific point in time.

**Example:** Database backups enable point-in-time recovery after data corruption.

#### Polyglot Persistence

The use of multiple database technologies within a single application.

**Example:** Applications might use Redis for caching and PostgreSQL for transactions.

#### PostgreSQL

An open-source relational database with advanced features and SQL compliance.

**Example:** PostgreSQL supports JSON data types alongside traditional relational features.

#### Primary Keys

Database constraints that uniquely identify rows in a table.

**Example:** Customer tables use customer_id as the primary key.

#### Quality Attribute Scenarios

Concrete examples that illustrate how quality attributes apply to specific system situations.

**Example:** "System responds to 1000 concurrent users within 2 seconds" describes a performance scenario.

#### Quality Attributes

System properties that describe how well a system performs its intended functions.

**Example:** Performance, security, and scalability are key quality attributes.

#### Quality Tree

A hierarchical structure that organizes quality attributes and their refinements.

**Example:** Performance quality trees might include response time and throughput branches.

#### Queryability

The ease with which data can be retrieved and analyzed through queries.

**Example:** SQL databases provide high queryability through standardized query language.

#### Query Optimization

The process of improving query performance through better execution strategies.

**Example:** Query optimizers choose index scans over table scans for selective queries.

#### Quorum

A minimum number of nodes that must agree before a distributed system operation can proceed.

**Example:** Cassandra quorum reads ensure consistency by reading from majority of replicas.

#### RBAC (Role-Based Access Control)

A security model that grants access based on user roles rather than individual permissions.

**Example:** Database administrators have different access roles than application users.

#### RDF (Resource Description Framework)

A framework for representing information about resources on the web.

**Example:** RDF triples describe relationships between web resources in semantic format.

#### Read-After-Write Consistency

A consistency model that ensures reads following writes return the written value.

**Example:** Social media posts appear immediately to the author after publishing.

#### Read Repair

A mechanism that fixes inconsistencies by comparing data during read operations.

**Example:** Cassandra read repair synchronizes data when inconsistencies are detected.

#### Real-Time Processing

The processing of data as it arrives without significant delay.

**Example:** Stream processing engines handle real-time event data for immediate analysis.

#### Redis

An in-memory data structure store used as a database, cache, and message broker.

**Example:** Redis stores session data for fast web application access.

#### Referential Integrity

The guarantee that foreign key relationships remain valid across database operations.

**Example:** Referential integrity prevents deletion of customers who have existing orders.

#### Reliability

The probability that a system will perform its intended function without failure.

**Example:** Database reliability measures include mean time between failures.

#### Replication

The process of copying data across multiple database servers for redundancy.

**Example:** Master-slave replication keeps backup servers synchronized with the primary.

#### Risks

Architectural elements that may prevent a system from achieving its quality attributes.

**Example:** Single points of failure represent availability risks.

#### Risk Themes

Categories of related risks that affect system quality attributes.

**Example:** Security risk themes might include authentication and data protection risks.

#### Roll-Up

The aggregation of detailed data into summary data at higher levels.

**Example:** Rolling up daily sales data into monthly and quarterly summaries.

#### Row-Oriented Storage

A data storage method that stores complete rows together sequentially.

**Example:** Traditional relational databases use row-oriented storage for transactional workloads.

#### SaaS (Software as a Service)

Cloud computing services that provide software applications over the internet.

**Example:** Salesforce provides CRM functionality as a SaaS application.

#### Scalability

The ability of a system to handle increased load by adding resources.

**Example:** Horizontal scalability adds more servers to handle growing user traffic.

#### Scenarios

Specific situations or use cases that demonstrate how quality attributes apply.

**Example:** Load testing scenarios simulate peak traffic conditions.

#### Schema Evolution

The process of modifying database schemas while maintaining backward compatibility.

**Example:** Adding new columns to existing tables without breaking existing applications.

#### Schema-on-Read

A data processing approach where schema is applied when data is read rather than written.

**Example:** Data lakes use schema-on-read to handle diverse data formats.

#### Schema-on-Write

A data processing approach where schema is enforced when data is written to storage.

**Example:** Relational databases use schema-on-write to ensure data consistency.

#### Schemaless

The ability to store data without predefined schema requirements.

**Example:** Document databases allow schemaless storage of JSON documents.

#### Schematron

A rule-based validation language for XML documents.

**Example:** Schematron validates business rules in XML documents beyond basic schema validation.

#### Secondary Indexes

Additional indexes created on columns other than the primary key.

**Example:** Email indexes on user tables enable fast lookups by email address.

#### Security

The protection of system resources and data from unauthorized access or modification.

**Example:** Database security includes authentication, authorization, and encryption.

#### Semantic Web

An extension of the web that enables machines to understand and process web content.

**Example:** RDF data enables semantic web applications to reason about relationships.

#### Semi-Structured Data

Data that has some organizational structure but doesn't fit rigid schemas.

**Example:** JSON documents represent semi-structured data with flexible schemas.

#### Sensitivity Points

Architectural elements where changes significantly affect quality attributes.

**Example:** Database connection pools are sensitivity points for performance.

#### Serverless Computing

A cloud computing model where the cloud provider manages server infrastructure.

**Example:** AWS Lambda runs code without provisioning or managing servers.

#### Service Level Agreement (SLA)

A contract that defines expected service performance levels.

**Example:** SLAs specify 99.9% uptime guarantees for cloud services.

#### Service Level Indicator (SLI)

A quantitative measure of service performance.

**Example:** Response time percentiles serve as SLIs for web services.

#### Service Level Objective (SLO)

A target value or range for service performance metrics.

**Example:** SLOs might target 95% of requests completing within 100ms.

#### Service Mesh

An infrastructure layer that handles service-to-service communication in microservices.

**Example:** Istio service mesh provides load balancing and security between microservices.

#### SGML (Standard Generalized Markup Language)

A markup language standard for defining document structure.

**Example:** HTML and XML are both derived from SGML principles.

#### Sharding

The horizontal partitioning of data across multiple database instances.

**Example:** User data sharding distributes users across multiple database servers.

#### Shortest Path

Graph algorithms that find the minimum distance between two nodes.

**Example:** GPS navigation uses shortest path algorithms to find optimal routes.

#### Slice and Dice

The operation of viewing data from different perspectives by selecting and filtering.

**Example:** Sales analysis tools slice and dice data by product, region, and time.

#### Slowly Changing Dimensions

Dimension table records that change slowly over time.

**Example:** Customer addresses change slowly and require historical tracking.

#### Snowflake Schema

A dimensional modeling approach where dimension tables are normalized.

**Example:** Snowflake schemas reduce redundancy by normalizing dimension tables.

#### Sparse Columns

Columns that contain null values for most rows.

**Example:** Product tables use sparse columns for optional attributes.

#### Sparse Data

Data where most values are zero or null.

**Example:** User preference matrices are sparse since users rate few products.

#### Sparse Indexes

Indexes that only include rows with non-null values in indexed columns.

**Example:** MongoDB sparse indexes skip documents with missing fields.

#### Spark

A distributed computing framework for large-scale data processing.

**Example:** Apache Spark processes big data analytics jobs across cluster nodes.

#### SPARQL

A query language for retrieving and manipulating RDF data.

**Example:** SPARQL queries extract information from semantic web knowledge graphs.

#### SQL (Structured Query Language)

A standardized language for managing relational databases.

**Example:** SQL SELECT statements retrieve data from relational database tables.

#### Stakeholders

Individuals or groups who have an interest in or are affected by a system.

**Example:** System stakeholders include users, developers, and business owners.

#### Star Schema

A dimensional modeling approach with a central fact table surrounded by dimension tables.

**Example:** Sales star schemas have sales facts connected to customer, product, and time dimensions.

#### Storm

A distributed stream processing framework for real-time data analysis.

**Example:** Apache Storm processes streaming data from social media feeds.

#### Streaming Analytics

The real-time analysis of data as it flows through a system.

**Example:** Streaming analytics detect fraudulent transactions as they occur.

#### Strong Consistency

A consistency model where all nodes return the same data simultaneously.

**Example:** Traditional relational databases provide strong consistency for transactions.

#### Structured Data

Data that is organized in a predefined format with clear relationships.

**Example:** Relational database tables contain structured data with defined columns.

#### Super Columns

Columns that contain multiple sub-columns in column-family databases.

**Example:** Cassandra super columns group related data within a single column.

#### Surrogate Keys

Artificial keys created solely for uniquely identifying rows.

**Example:** Auto-incrementing ID columns serve as surrogate keys.

#### Time-Series Data

Data points collected over time intervals, typically for analysis of trends.

**Example:** IoT sensors generate time-series data for temperature monitoring.

#### Time-Series Databases

Specialized databases optimized for storing and querying time-series data.

**Example:** InfluxDB stores metrics data with timestamp-based indexing.

#### Time-To-Live (TTL)

A mechanism that automatically expires data after a specified time period.

**Example:** Cache entries use TTL to automatically remove stale data.

#### TigerGraph

A graph database designed for real-time analytics on large-scale graphs.

**Example:** TigerGraph analyzes fraud patterns in financial transaction networks.

#### Token Ranges

Ranges of hash values that determine data distribution in consistent hashing.

**Example:** Cassandra assigns token ranges to nodes for data distribution.

#### Tombstones

Markers that indicate deleted data in distributed databases.

**Example:** Cassandra tombstones mark deleted records for eventual cleanup.

#### Tradeoffs

The architectural decisions that improve one quality attribute at the expense of another.

**Example:** Caching improves performance but may reduce consistency.

#### Transformability

The ease with which a system can be modified to incorporate new requirements.

**Example:** Plugin architectures provide high transformability for extending functionality.

#### Triple Store

A database designed for storing and querying RDF triples.

**Example:** Triple stores enable semantic web applications to query knowledge graphs.

#### Tunable Consistency

The ability to adjust consistency levels based on application requirements.

**Example:** Cassandra allows tunable consistency from eventual to strong consistency.

#### Two-Phase Commit (2PC)

A distributed transaction protocol that ensures atomicity across multiple databases.

**Example:** 2PC coordinates commits across multiple database systems.

#### Typeswitch

A conditional construct in XQuery that performs different actions based on data types.

**Example:** Typeswitch handles different XML element types in query processing.

#### Unstructured Data

Data that doesn't fit into traditional row-column database structures.

**Example:** Text documents, images, and videos are unstructured data.

#### Usability

The ease with which users can learn and use a system effectively.

**Example:** Intuitive user interfaces improve system usability.

#### User Stories

Short descriptions of system features from the user's perspective.

**Example:** "As a customer, I want to view my order history" is a user story.

#### Utility Tree

A hierarchical structure that organizes quality attributes by their importance to stakeholders.

**Example:** Utility trees prioritize performance over security for gaming applications.

#### Variability

The degree to which data values differ from each other.

**Example:** Customer age data shows low variability while income data shows high variability.

#### Vector Clocks

A logical clock mechanism for ordering events in distributed systems.

**Example:** Vector clocks resolve conflicts in distributed database updates.

#### Vectorized Processing

A processing technique that applies operations to multiple data elements simultaneously.

**Example:** Columnar databases use vectorized processing for efficient aggregations.

#### Velocity

The speed at which data is generated and processed.

**Example:** High-velocity data streams require real-time processing capabilities.

#### Veracity

The accuracy and trustworthiness of data.

**Example:** Data validation ensures veracity by checking for errors and inconsistencies.

#### Vertical Scaling

The practice of adding more power to existing servers to handle increased load.

**Example:** Upgrading database servers with more RAM provides vertical scaling.

#### Virtual Nodes (vnodes)

A technique that divides each physical node into multiple virtual nodes for better data distribution.

**Example:** Cassandra vnodes improve load balancing across cluster nodes.

#### Volume

The amount of data that needs to be stored and processed.

**Example:** Big data applications handle large volumes of data across distributed systems.

#### Write-Ahead Logging

A technique that logs changes before applying them to ensure durability.

**Example:** Database WAL ensures recovery after system crashes.

#### XML (Extensible Markup Language)

A markup language for encoding documents in human-readable format.

**Example:** XML documents store structured data with custom tags.

#### XML Schema (XSD)

A language for describing the structure and constraints of XML documents.

**Example:** XSD validates that XML documents conform to expected structures.

#### XPath

A query language for selecting nodes from XML documents.

**Example:** XPath expressions extract specific elements from XML documents.

#### XQuery

A query language for finding and extracting information from XML documents.

**Example:** XQuery transforms XML data into different formats for presentation.

#### XSLT (Extensible Stylesheet Language Transformations)

A language for transforming XML documents into other formats.

**Example:** XSLT transforms XML data into HTML for web presentation.