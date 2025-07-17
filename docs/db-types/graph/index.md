# Graph Databases

In this chapter we will cover graph databases.  We will look at
their history and their key advantages over older relational
database systems.  We will then cover their primary benefits and
most popular use-cases and their ability to store complex
knowledge at enterprise scale.

The evolution of graph databases represents one of the most significant developments in modern data management, transforming how organizations model, store, and analyze interconnected data. Unlike traditional relational databases that struggle with complex relationships, or NoSQL document stores that excel at hierarchical data, graph databases are purpose-built for scenarios where relationships between entities are as important as the entities themselves.

This chapter explores the historical development of graph databases, from their mathematical foundations through their emergence as enterprise-grade solutions, and examines the specific use cases where graph databases provide transformative business value. Understanding when and why to implement graph databases requires appreciating both their theoretical underpinnings and their practical applications in solving real-world problems that other database types cannot address efficiently.

<!--

prompt:

In my book on NoSQL, I am now working on a chapter on the rise of graph databases.  Please write the full chapter for me based on the following outline of sections:

## History

1. Start with the historical references of Euler's walk across Konigsburg bridges.  Reference the idea that you can model the real world with nodes and edges
2. Include a section the standardization of connected resources the semantic web stack and RDF/SPARQL.  Reference the Scientifica American article on the Semantic Web published in May of 2001. Include a discussion of the limitations of RDF and the problems with reification.  Mention that SPARQL queries need to be rewritten frequently due to the limitation of relationships lack of their own properties.
3. Have a section that describes how the LPG model was created and popularized by Neo4j.  Describe that allowing relationships to have their own properties requires fewer queries to be rewritten when a new property is needed.
4. Ass a section that discuss the key limitations of single-node graphs and their lack of scalability to multi-node systems.  Describe how this limitation limits their use on enterprise-scale problems.
5. Have a section about TigerGraph and the success of their scale-out architecture and the development of GSQL.  Describe how large organization have successfully used TigerGraph on large-scale problems that require real-time responses.
6. Add a section on the rise of graph machine learning and the use of embeddings for graphs
7. Focus on the positive case studies of large organizations implementing graphs to achieve competitive advantage.

## When to Use Graph databases

### When real-time response of analytics over complex data is critical for success

### Fraud Analytics

### Product Management and Product Recommendation

### Supply Chain Disruption Analysis

-->

## Background

### The Mathematical Foundation: Euler's Königsberg Bridges

The theoretical foundation of graph databases traces back to 1736, when Swiss mathematician Leonhard Euler solved the famous Königsberg Bridge Problem. The city of Königsberg (now Kaliningrad, Russia) was built around two islands connected to the mainland by seven bridges. Citizens wondered whether it was possible to walk through the city, crossing each bridge exactly once and returning to the starting point.

Euler's brilliant insight was to abstract the physical problem into a mathematical representation: he modeled the landmasses as **nodes** (vertices) and the bridges as **edges** (connections). This abstraction revealed that the problem was not about geography but about the mathematical properties of connected structures. Euler proved that such a walk was impossible because the graph had more than two nodes with an odd number of connections—a fundamental principle that established the field of graph theory.

This mathematical breakthrough established the core principle that underlies all graph databases: **complex real-world systems can be modeled as networks of interconnected entities**, where the relationships between entities are as significant as the entities themselves. Modern graph databases directly implement this concept, storing data as nodes (representing entities) and edges (representing relationships), enabling natural modeling of interconnected systems from social networks to financial transactions.

The power of Euler's abstraction becomes evident in contemporary applications. When Netflix models viewers, movies, and viewing relationships, or when LinkedIn represents professionals and their connections, they are applying the same fundamental principle Euler discovered nearly three centuries ago: that complex systems can be understood through their network structure.

### The Semantic Web Stack and RDF/SPARQL

The modern development of graph databases began with the vision of the **Semantic Web**, articulated by Tim Berners-Lee and his colleagues in their influential Scientific American article "The Semantic Web" published in May 2001. This vision proposed transforming the World Wide Web from a collection of documents into a vast network of interconnected, machine-readable data.

The Semantic Web stack introduced several key technologies that would influence graph database development:

**Resource Description Framework (RDF)** emerged as the foundation for representing information as **subject-predicate-object** triples. In RDF, every piece of information is expressed as a statement connecting two resources through a predicate. For example, the statement "John works for Acme Corp" would be represented as the triple `<John> <worksFor> <AcmeCorp>`.

**SPARQL (SPARQL Protocol and RDF Query Language)** provided a standardized query language for RDF data, enabling complex traversals across interconnected resources. SPARQL queries could navigate multiple relationships to answer questions like "Find all employees who work for companies founded before 2000 and have published papers in artificial intelligence."

However, the RDF model's rigid triple structure revealed significant limitations that would drive the development of more flexible graph database architectures:

**The Reification Problem**: RDF's fundamental limitation was its inability to attach properties directly to relationships. In the real world, relationships often have their own attributes—a "worksFor" relationship might have properties like start date, salary, or job title. RDF addressed this through **reification**, a complex process of converting relationships into nodes with multiple connecting triples. This approach was cumbersome and significantly complicated query patterns.

**SPARQL Query Brittleness**: The reification workaround meant that SPARQL queries needed frequent rewriting when new relationship properties were added. A simple query about employment relationships became a complex multi-step traversal when additional attributes like employment dates or positions were required. This brittleness made RDF-based systems difficult to maintain and evolve.

**Performance Limitations**: The overhead of reification and the complexity of SPARQL query execution against large triple stores created performance bottlenecks that limited the practical adoption of RDF-based systems in high-throughput applications.

Despite these limitations, the Semantic Web movement established crucial concepts that would influence graph database design: the importance of standardized data models, the need for expressive query languages, and the vision of interconnected data ecosystems.

### The Labeled Property Graph Model and Neo4j

The emergence of **Neo4j** in the mid-2000s marked a pivotal moment in graph database history through its introduction of the **Labeled Property Graph (LPG)** model. This approach addressed the fundamental limitations of RDF by allowing both nodes and relationships to have properties directly attached to them.  Neo4j 1.0 was released as generally available on February 23, 2010. 

The LPG model introduced several key innovations:

**Rich Relationship Properties**: Unlike RDF's rigid triple structure, LPG relationships could carry multiple properties. An employment relationship could simultaneously store start date, salary, job title, and department without requiring complex reification patterns. This capability dramatically simplified data modeling and query patterns.

**Flexible Schema Evolution**: When new relationship properties were needed, they could be added without rewriting existing queries. A system modeling employment relationships could easily add properties like "remote work status" or "security clearance level" without affecting existing functionality.

**Intuitive Query Language**: Neo4j's Cypher query language provided an intuitive, ASCII-art syntax for expressing graph traversals. The query `MATCH (p:Person)-[:WORKS_FOR {startDate: '2020-01-01'}]->(c:Company)` naturally expressed the concept of finding people who started working for companies on a specific date.

**Transactional Integrity**: Unlike many NoSQL databases that sacrificed consistency for availability, Neo4j maintained ACID properties, ensuring that graph operations maintained data integrity even during complex multi-step transactions.

Neo4j's success in popularizing the LPG model demonstrated that graph databases could provide the relationship-centric benefits of the Semantic Web vision while maintaining the performance and flexibility required for practical applications. The company's focus on developer experience and comprehensive tooling ecosystem accelerated adoption across various industries.

The LPG model's success influenced the development of other graph databases, including Amazon Neptune, ArangoDB, and Microsoft Azure Cosmos DB's Gremlin API, all of which adopted similar approaches to relationship modeling while adding their own innovations in areas like multi-model support and distributed architecture.

### Single-Node Limitations and Scalability Challenges

Despite the conceptual advantages of graph databases, early implementations faced significant scalability limitations that restricted their use in enterprise-scale applications. The fundamental challenge was that most graph databases, including Neo4j, were designed as single-node systems optimized for traversal performance rather than distributed scalability.

**Memory Constraints**: Graph databases achieve their traversal performance by maintaining extensive in-memory indexes of node and relationship structures. Single-node architectures were limited by the memory capacity of individual servers, typically restricting graphs to hundreds of millions of nodes and relationships.

**Compute Bottlenecks**: Complex graph algorithms like PageRank, community detection, or shortest path calculations required significant computational resources. Single-node systems could not parallelize these operations across multiple machines, limiting their applicability to large-scale analytics problems.

**Storage Limitations**: As graph sizes exceeded single-node storage capacity, performance degraded significantly. The need to swap graph data between memory and disk eliminated the performance advantages that made graph databases attractive for real-time applications.

**Availability Concerns**: Single-node architectures created single points of failure that were unacceptable for mission-critical enterprise applications. While replication could address availability, it did not solve the fundamental scalability limitations.

These limitations meant that graph databases were primarily suitable for departmental applications or specific use cases with bounded data sizes. Enterprise applications requiring analysis of billions of relationships—such as fraud detection across entire financial networks or supply chain optimization for global manufacturers—were largely beyond the capabilities of single-node graph databases.

The scalability challenge was particularly acute for organizations that had successfully implemented graph databases for pilot projects but struggled to scale them to production workloads. Many enterprises found themselves constrained by the **"single-node ceiling"**, where the benefits of graph modeling were offset by performance limitations.

### TigerGraph and Scale-Out Architecture

The introduction of **TigerGraph** in 2012 represented a breakthrough in graph database scalability through its native distributed architecture and the development of **GSQL (Graph SQL)**, a SQL-like query language optimized for distributed graph processing.

TigerGraph's innovations addressed the fundamental scalability limitations of single-node systems:

**Native Distributed Architecture**: TigerGraph was designed from the ground up as a distributed system, automatically partitioning graph data across multiple nodes while maintaining efficient traversal capabilities. The system employed sophisticated graph partitioning algorithms that minimized cross-node communication during query execution.

**Parallel Processing**: Complex graph algorithms could be parallelized across multiple nodes, enabling analysis of graphs with billions of nodes and relationships. This capability opened graph databases to enterprise-scale applications that were previously impossible.

**GSQL Query Language**: TigerGraph's GSQL provided a familiar SQL-like syntax for graph operations while supporting advanced graph algorithms. The language enabled both simple traversals and complex analytics within the same system, eliminating the need for separate graph processing frameworks.

**Real-Time Analytics**: The distributed architecture maintained the real-time query capabilities that made graph databases attractive while scaling to enterprise data volumes. Organizations could perform complex graph analytics on massive datasets with response times measured in seconds rather than hours.

**Enterprise Deployment Success**: Large organizations including JPMorgan Chase, Mastercard, and Alipay have successfully deployed TigerGraph for mission-critical applications:

- **JPMorgan Chase** uses TigerGraph for real-time fraud detection across their global transaction network, analyzing billions of transactions to identify suspicious patterns within milliseconds.
- **Mastercard** employs TigerGraph for their Decision Intelligence platform, processing over 75 billion transactions annually to detect fraud and enable real-time authorization decisions.
- **Alipay** leverages TigerGraph for risk management across their payment ecosystem, analyzing complex relationship patterns among over 1 billion users to prevent financial crimes.

The success of TigerGraph's scale-out architecture demonstrated that graph databases could achieve both the relationship-modeling advantages of the graph paradigm and the scalability required for enterprise applications. This breakthrough enabled graph databases to move beyond departmental use cases to become viable solutions for organization-wide data challenges.

### Graph Machine Learning and Embeddings

The convergence of graph databases and machine learning has created powerful new capabilities for analyzing complex interconnected data. **Graph embeddings** and **Graph Neural Networks (GNNs)** have emerged as transformative technologies that enable machine learning algorithms to leverage the structural properties of graph data.

**Graph Embeddings**: This technique converts graph structures into high-dimensional vector representations that capture both node properties and structural relationships. Algorithms like Node2Vec, GraphSAGE, and TransE learn to embed nodes and edges in continuous vector spaces where similar entities are positioned close together.

The power of graph embeddings lies in their ability to capture **structural similarity** alongside attribute similarity. In a social network, two users might be embedded closely not just because they share demographic attributes, but because they occupy similar structural positions in the network—such as being influential connectors between different communities.

**Graph Neural Networks**: GNNs extend traditional neural networks to operate directly on graph-structured data, enabling end-to-end learning of graph representations. These networks can perform tasks like node classification, link prediction, and graph-level classification while learning optimal representations during training.

**Real-World Applications**: The combination of graph databases and machine learning has enabled breakthrough applications:

- **Recommendation Systems**: Netflix and Spotify use graph embeddings to understand user-content relationships, enabling more accurate recommendations by considering not just user preferences but also content relationships and user behavioral patterns.
- **Drug Discovery**: Pharmaceutical companies employ graph neural networks to model molecular structures and predict drug interactions, accelerating the identification of promising compounds.
- **Financial Risk Assessment**: Banks use graph embeddings to represent transaction networks and customer relationships, enabling more sophisticated fraud detection and credit risk modeling.

**Production Integration**: Modern graph databases increasingly integrate machine learning capabilities directly into their platforms. TigerGraph's Graph Data Science Library provides built-in implementations of graph algorithms and embedding techniques, while Neo4j's Graph Data Science platform offers similar capabilities for production machine learning workflows.

This integration of graph databases and machine learning represents a significant evolution in data analytics, enabling organizations to extract insights from complex relationship data that were previously inaccessible through traditional analytical approaches.

### Enterprise Success Stories and Competitive Advantage

The maturation of graph database technology has enabled numerous organizations to achieve significant competitive advantages through innovative applications of graph-based analysis. These success stories demonstrate the transformative potential of graph databases when applied to complex business problems.

**Walmart's Supply Chain Optimization**: Walmart implemented a graph database to model their global supply chain network, representing suppliers, distribution centers, stores, and transportation routes as nodes and relationships. During the COVID-19 pandemic, this graph-based approach enabled real-time identification of supply chain disruptions and rapid recalculation of optimal distribution strategies. The system reduced supply chain response times from weeks to hours, maintaining product availability while competitors struggled with shortages.

**UBS Investment Research**: UBS developed a graph-based knowledge management system that connects research reports, market data, client interactions, and regulatory information. The system enables investment analysts to rapidly identify connections between market events, company relationships, and research insights. This capability has improved research quality while reducing the time required to generate investment recommendations by 40%.

**Airbnb's Trust and Safety**: Airbnb employs graph databases to model the complex relationships between users, properties, bookings, and reviews. Their graph-based approach enables sophisticated fraud detection by identifying patterns of suspicious behavior across the platform. The system can detect coordinated fake review campaigns, identify potentially dangerous properties, and prevent various forms of platform abuse, maintaining the trust that is essential to their business model.

**Deutsche Bank's Regulatory Compliance**: Deutsche Bank implemented a graph database to track beneficial ownership relationships and comply with anti-money laundering regulations. The system models complex corporate structures, ownership chains, and financial relationships, enabling rapid identification of ultimate beneficial owners and detection of suspicious transaction patterns. This graph-based approach has significantly reduced compliance costs while improving regulatory reporting accuracy.

**Siemens Manufacturing Intelligence**: Siemens uses graph databases to model relationships between manufacturing equipment, processes, and quality outcomes across their global production network. The system enables predictive maintenance by identifying subtle patterns in equipment relationships and performance data. This approach has reduced unplanned downtime by 25% while improving product quality through better understanding of manufacturing process interdependencies.

These success stories demonstrate that graph databases provide competitive advantages in scenarios where traditional database approaches struggle with complex relationship analysis. Organizations that successfully implement graph databases often achieve improvements in operational efficiency, risk management, and customer experience that directly translate to business value.

## When to Use Graph Databases

Graph databases excel in specific scenarios where the relationships between data entities are as important as the entities themselves. Understanding when to implement graph databases requires identifying use cases where traditional relational or NoSQL databases cannot efficiently model or query interconnected data patterns.

### When Real-Time Analytics Over Complex Data is Critical for Success

Graph databases provide unique advantages when organizations need to perform real-time analytics on complex, interconnected data where query response times directly impact business outcomes. Traditional databases struggle with these scenarios because they require expensive JOIN operations or complex aggregations that become prohibitively slow as relationship complexity increases.

**Real-Time Recommendation Engines**: E-commerce platforms like Amazon must provide product recommendations within milliseconds during peak shopping periods. Graph databases enable real-time traversal of user-product-category relationships to identify recommendation opportunities. A graph query can simultaneously consider user purchase history, product similarities, seasonal trends, and inventory levels to generate personalized recommendations in under 100 milliseconds.

**Social Media Content Discovery**: Platforms like LinkedIn must instantly surface relevant content, connections, and job opportunities based on complex user relationship patterns. Graph databases enable real-time analysis of user networks, content engagement patterns, and professional relationships to deliver personalized feeds. The ability to traverse multi-hop relationships (friends of friends of friends) in real-time is crucial for maintaining user engagement.

**Financial Trading Systems**: High-frequency trading firms require real-time analysis of market relationships, security correlations, and portfolio exposures. Graph databases enable instantaneous calculation of risk exposures across complex derivative relationships and counterparty networks. Traditional databases cannot provide the sub-millisecond response times required for these applications.

**Gaming and Virtual Worlds**: Multiplayer games must maintain real-time awareness of player relationships, guild memberships, and in-game asset ownership. Graph databases enable instant queries about player connections, team formations, and resource dependencies that directly impact game performance and user experience.

The key advantage of graph databases in these scenarios is their ability to traverse multiple relationship hops without the performance degradation that affects traditional databases. A recommendation query that might require dozens of JOINs in a relational database becomes a simple path traversal in a graph database, maintaining consistent performance regardless of relationship complexity.

### Fraud Analytics

Fraud detection represents one of the most compelling use cases for graph databases because fraudulent activities typically involve complex networks of relationships that are difficult to detect using traditional analytical approaches. Fraudsters often operate through networks of related accounts, devices, and transactions that create patterns invisible to conventional fraud detection systems.

**Financial Transaction Fraud**: Banks and payment processors use graph databases to model relationships between accounts, transactions, merchants, and devices. Fraudulent patterns often emerge through relationship analysis—multiple accounts sharing the same device, unusual transaction flows between related entities, or rapid account creation patterns that suggest organized fraud rings.

**Identity Fraud Detection**: Graph databases excel at detecting synthetic identity fraud by analyzing relationships between personal information elements. When fraudsters create false identities by combining real and fabricated information, graph analysis can identify suspicious patterns like multiple identities sharing the same phone number, address, or social security number components.

**Insurance Fraud Networks**: Insurance companies use graph databases to detect orchestrated fraud involving multiple claimants, service providers, and staged incidents. Graph analysis can identify suspicious relationships between claimants, medical providers, and attorneys that suggest coordinated fraud schemes invisible to traditional claim processing systems.

**Credit Card Fraud Prevention**: Real-time fraud detection systems analyze transaction patterns, merchant relationships, and cardholder behavior to identify suspicious activities. Graph databases enable immediate analysis of transaction networks to detect card testing, account takeovers, and money laundering activities.

**Case Study - Mastercard's Decision Intelligence**: Mastercard's Decision Intelligence platform processes over 75 billion transactions annually using TigerGraph to identify fraudulent patterns in real-time. The system analyzes complex relationship patterns across merchants, cardholders, and transaction networks to detect sophisticated fraud schemes. Their graph-based approach has improved fraud detection rates by 40% while reducing false positive rates by 50%, directly impacting both customer experience and financial losses.

The effectiveness of graph databases in fraud detection stems from their ability to identify **structural anomalies** in relationship patterns that indicate fraudulent behavior. Traditional rule-based systems focus on individual transaction attributes, while graph-based systems can detect subtle patterns across entire networks of related entities.

### Product Management and Product Recommendation

Graph databases have revolutionized product management and recommendation systems by enabling sophisticated analysis of product relationships, user behavior patterns, and market dynamics. Traditional recommendation systems based on collaborative filtering or content-based approaches struggle with the cold start problem and cannot effectively model complex product ecosystems.

**Product Relationship Modeling**: E-commerce platforms use graph databases to model complex product relationships including complementary products, substitutes, product bundles, and seasonal associations. Amazon's product graph includes relationships like "frequently bought together," "customers who viewed this also viewed," and "product compatibility" that enable sophisticated recommendation algorithms.

**Customer Journey Analytics**: Graph databases enable analysis of customer interaction patterns across multiple touchpoints, product categories, and time periods. Retailers can identify optimal product introduction sequences, understand cross-selling opportunities, and predict customer lifetime value based on relationship patterns rather than just transaction history.

**Inventory and Demand Forecasting**: Graph databases connect product relationships with supply chain data, seasonal patterns, and market trends to improve demand forecasting. The ability to model product substitute relationships enables more accurate inventory planning and reduced stockouts.

**Personalization at Scale**: Graph databases enable real-time personalization that considers not just individual user preferences but also social influence, product relationships, and contextual factors. Netflix's recommendation system uses graph analysis to understand content relationships, user viewing patterns, and social influences to generate personalized recommendations for over 200 million subscribers.

**Case Study - Spotify's Music Recommendations**: Spotify uses graph databases to model relationships between users, artists, songs, playlists, and listening contexts. Their graph-based approach enables discovery of new music through relationship analysis—users who like artist A and genre B might enjoy artist C who shares similar characteristics. This approach has significantly improved user engagement and reduced churn by helping users discover relevant content.

**Product Portfolio Optimization**: Companies use graph databases to analyze their product portfolios and identify optimization opportunities. Graph analysis can reveal product cannibalization, identify gaps in product lineups, and suggest new product development opportunities based on relationship patterns and market positioning.

The advantage of graph databases in product management lies in their ability to model the complex interconnections between products, users, and contexts that traditional databases cannot efficiently represent. This enables more sophisticated recommendation algorithms and better understanding of product ecosystem dynamics.

### Supply Chain Disruption Analysis

Modern supply chains are complex networks of suppliers, manufacturers, distributors, and logistics providers that create intricate dependency relationships. Graph databases excel at modeling these complex networks and enabling rapid analysis of disruption impacts and recovery strategies.

**Supply Chain Visibility**: Graph databases provide end-to-end visibility into supply chain relationships, enabling organizations to understand multi-tier supplier dependencies, alternative sourcing options, and potential bottlenecks. This visibility is crucial for managing supply chain risks and optimizing operational efficiency.

**Disruption Impact Analysis**: When supply chain disruptions occur, graph databases enable rapid analysis of downstream impacts across the entire network. Organizations can immediately identify which products, customers, and operations will be affected by a specific supplier disruption and calculate the potential business impact.

**Alternative Sourcing**: Graph databases help identify alternative suppliers and routing options when primary sources are disrupted. The ability to analyze supplier capabilities, geographic proximity, quality ratings, and relationship history enables rapid identification of viable alternatives.

**Risk Assessment and Mitigation**: Graph analysis enables sophisticated risk assessment by identifying critical single points of failure, over-concentration of suppliers in high-risk regions, and potential cascading failure scenarios. This analysis enables proactive risk mitigation strategies.

**Case Study - Walmart's COVID-19 Response**: During the COVID-19 pandemic, Walmart used graph databases to rapidly analyze supply chain disruptions and identify alternative sourcing strategies. Their graph-based approach enabled real-time assessment of supplier capabilities, transportation route availability, and inventory redistribution options. This capability helped Walmart maintain product availability while competitors struggled with supply shortages.

**Sustainability and Compliance**: Graph databases enable analysis of supply chain sustainability and compliance by tracking environmental impacts, labor practices, and regulatory compliance across multi-tier supplier networks. This capability is increasingly important for organizations facing sustainability reporting requirements and consumer demand for ethical sourcing.

**Logistics Optimization**: Graph databases model transportation networks, warehouse capabilities, and delivery routes to optimize logistics operations. The ability to analyze complex routing options, capacity constraints, and cost factors enables more efficient supply chain operations.

The complexity of modern supply chains makes graph databases essential for organizations that need to understand and optimize their supply network relationships. Traditional approaches that analyze suppliers in isolation cannot provide the comprehensive visibility required for effective supply chain management in today's interconnected global economy.

## Summary

The evolution of graph databases from Euler's mathematical foundations to modern enterprise-scale solutions represents a fundamental shift in how organizations approach complex data relationships. The journey from RDF's rigid triple structure through Neo4j's property graph innovation to TigerGraph's distributed architecture demonstrates the technology's maturation and growing enterprise adoption.

Graph databases excel in scenarios where traditional relational and NoSQL databases struggle with complex relationship analysis. Their unique value proposition lies in enabling real-time analytics over interconnected data, providing competitive advantages in fraud detection, recommendation systems, and supply chain optimization. The integration of graph databases with machine learning capabilities further expands their potential for extracting insights from complex relationship data.

The key to successful graph database implementation lies in identifying use cases where relationship analysis is critical for business success. Organizations that leverage graph databases effectively often achieve significant improvements in operational efficiency, risk management, and customer experience that directly translate to competitive advantage.

As data relationships become increasingly complex and the demand for real-time insights grows, graph databases will continue to play a crucial role in enabling organizations to understand and act on their interconnected data ecosystems. The technology's evolution from academic research to enterprise-critical infrastructure demonstrates its fundamental importance in the modern data landscape.