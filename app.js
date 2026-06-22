// Global Constants and State
const API_KEY = ""; // Your Gemini API Key (left blank as per instructions)
const APP_CONTAINER = document.getElementById('app-container');
const SCREENS = ['auth-screen', 'category-screen', 'quiz-screen', 'result-screen'];
const QUIZ_CATEGORIES = [

    { name: "C Programming", icon: "fa-terminal" },
    { name: "Java", icon: "fa-coffee" },
    { name: "C++ Programming", icon: "fa-code-branch" },
    { name: "Python", icon: "fab fa-python" },

    { name: "Software Development", icon: "fa-code" },
    { name: "Data Structures & Algos (DSA)", icon: "fa-cubes" },
    { name: "DevOps & Cloud", icon: "fa-cloud" },
    { name: "Cyber Security", icon: "fa-shield-alt" },
    { name: "Artificial Intelligence", icon: "fa-microchip" },
    { name: "Web Technologies (HTML/CSS/JS)", icon: "fa-laptop-code" },
    { name: "Database Systems (SQL/NoSQL)", icon: "fa-database" },
    // Three new categories added
    { name: "Network Engineering", icon: "fa-network-wired" },
    { name: "Game Development", icon: "fa-gamepad" },
    { name: "Quantum Computing", icon: "fa-atom" }
];

// Local question bank fallback (20 tough, real-world style questions per category)
const LOCAL_QUESTIONS = {
    "Software Development": [
        { question: "Describe the primary trade-offs between monolithic and microservices architectures.", options: ["A: Monoliths are easier to scale; Microservices are harder to maintain", "B: Monoliths simplify deployment; Microservices improve modularity and scaling", "C: Microservices always reduce latency; Monoliths increase modularity", "D: Monoliths are language-agnostic; Microservices are not"], correct_answer: "B" },
        { question: "How does the CAP theorem influence the design of distributed databases?", options: ["A: It mandates consistency and availability only", "B: It requires choosing between Consistency, Availability, and Partition tolerance", "C: It suggests databases must be ACID compliant", "D: It enforces read-after-write consistency"], correct_answer: "B" },
        { question: "What is a common anti-pattern when using ORM tools in high-throughput systems?", options: ["A: Overuse of eager loading causing N+1 queries", "B: Avoiding prepared statements", "C: Using connection pooling", "D: Leveraging batch inserts"], correct_answer: "A" },
        { question: "Explain how feature flags can be used safely in production.", options: ["A: Toggle features directly in code without tests", "B: Use gradual rollout and monitoring with kill-switches", "C: Only enable flags for internal users permanently", "D: Ship incomplete features behind flags without metrics"], correct_answer: "B" },
        { question: "When should you use event sourcing versus a CRUD model?", options: ["A: Event sourcing for simple apps; CRUD for complex auditing", "B: Event sourcing when you need an audit log and temporal queries", "C: CRUD for immutable state; Event sourcing for relational models", "D: They are interchangeable"], correct_answer: "B" },
        { question: "Name a risk when relying heavily on third-party APIs in core product flows.", options: ["A: Reduced latency", "B: Vendor lock-in and availability dependencies", "C: More control over schema", "D: Improved security"], correct_answer: "B" },
        { question: "What is contract testing and why is it important?", options: ["A: Testing UI contracts only", "B: Validating API interactions between services to prevent integration regressions", "C: Replacing unit tests", "D: Testing database schemas"], correct_answer: "B" },
        { question: "How does continuous integration differ from continuous deployment?", options: ["A: CI is about building and testing; CD automates releases to production", "B: They are the same", "C: CD only handles testing", "D: CI deploys to production"], correct_answer: "A" },
        { question: "What causes memory leaks in modern managed languages?", options: ["A: Lack of garbage collector", "B: Unreleased references, caches without eviction, or listener leaks", "C: Using functional programming", "D: Small heap sizes"], correct_answer: "B" },
        { question: "Why is idempotency important for webhooks and APIs?", options: ["A: It improves authentication", "B: It ensures safe retry behavior without side-effects", "C: It reduces payload size", "D: It makes APIs stateful"], correct_answer: "B" },
        { question: "How would you approach designing a feature to roll back database schema changes safely?", options: ["A: Drop columns immediately", "B: Use backward-compatible schema changes, feature flags, and data migrations", "C: Never change schemas", "D: Rely solely on nightly backups"], correct_answer: "B" },
        { question: "What is the role of SLI/SLOs in production reliability?", options: ["A: They are only for finance teams", "B: Define service level indicators and objectives to measure reliability and guide trade-offs", "C: Replace all unit tests", "D: Only used post-mortems"], correct_answer: "B" },
        { question: "Explain the concept of semantic versioning and breaking changes.", options: ["A: Patch version for breaking changes", "B: Major version increments indicate breaking API changes", "C: Minor version for security fixes", "D: Semantic versioning is obsolete"], correct_answer: "B" },
        { question: "What's the security concern with including secrets in source control?", options: ["A: Easier auditing", "B: Secrets may leak and cause compromise of environments", "C: It speeds up onboarding", "D: It improves redundancy"], correct_answer: "B" },
        { question: "When is it appropriate to use optimistic concurrency control?", options: ["A: For high-contention writes", "B: When conflicts are rare and you prefer to retry over locking", "C: Never", "D: Only in single-threaded apps"], correct_answer: "B" },
        { question: "Describe a robust strategy for rolling back a bad deployment.", options: ["A: Immediate rollback of the codebase without data considerations", "B: Use automated canary rollback with feature flags, DB compatibility checks and staged rollbacks", "C: Delete production database", "D: Ask users to refresh"], correct_answer: "B" },
        { question: "Why is observability more than logging?", options: ["A: Observability equals logs", "B: It includes metrics, tracing, and logs to understand system behavior", "C: It only uses dashboards", "D: It focuses solely on synthetic tests"], correct_answer: "B" },
        { question: "How does dependency injection improve testability?", options: ["A: By hardcoding dependencies", "B: By decoupling consumers from concrete implementations, enabling mocking", "C: It decreases modularity", "D: It increases compile times"], correct_answer: "B" },
        { question: "What is trunk-based development and its benefit?", options: ["A: Long-lived feature branches", "B: Frequent small merges to main to reduce integration conflicts", "C: Disables CI", "D: Encourages big-bang merges"], correct_answer: "B" }
    ],
    "Network Engineering": [
        { question: "Explain why BGP prefix hijacking occurs and one mitigation approach.", options: ["A: It's impossible", "B: Misconfiguration or malicious announcements; use RPKI and route filtering", "C: Due to DNS issues", "D: Only affects LANs"], correct_answer: "B" },
        { question: "What's the difference between TCP and UDP in congestion control?", options: ["A: Both do congestion control the same", "B: TCP has built-in congestion control; UDP does not by default", "C: UDP is always reliable", "D: TCP is stateless"], correct_answer: "B" },
        { question: "How does MPLS improve routing performance?", options: ["A: It replaces IP", "B: Uses label switching to forward packets without deep routing table lookups", "C: It encrypts packets", "D: It's only for Wi-Fi"], correct_answer: "B" },
        { question: "Why are VLANs used and what issue can arise from misconfigured VLANs?", options: ["A: They slow networks", "B: Provide L2 segmentation; misconfiguration can cause broadcast storms or improper isolation", "C: They are obsolete", "D: They replace routing"], correct_answer: "B" },
        { question: "Explain NAT traversal challenges for peer-to-peer applications.", options: ["A: NAT always allows incoming connections", "B: NAT hides internal addresses, making direct inbound connections difficult; STUN/TURN help", "C: NAT increases IP count", "D: NAT is only in IPv6"], correct_answer: "B" },
        { question: "What is QoS and why is it critical for VoIP?", options: ["A: It compresses audio", "B: Prioritizes latency-sensitive traffic to maintain call quality", "C: It encrypts voice", "D: It is unnecessary"], correct_answer: "B" },
        { question: "Describe how link aggregation (LACP) increases throughput.", options: ["A: It duplicates packets", "B: Combines multiple physical links into one logical link for load balancing and redundancy", "C: It routes around congestion", "D: It disables STP"], correct_answer: "B" },
        { question: "When should you use IPv6 over IPv4?", options: ["A: Never", "B: When you need a vast address space and modern features like SLAAC", "C: Only for private networks", "D: For backward compatibility"], correct_answer: "B" },
        { question: "What causes asymmetric routing and why is it problematic for stateful firewalls?", options: ["A: It never happens", "B: Different return paths can break connection tracking on stateful devices", "C: It improves security", "D: It's a DNS issue"], correct_answer: "B" },
        { question: "Explain the role of spanning tree protocol (STP) in Ethernet networks.", options: ["A: To increase loops", "B: Prevent switching loops by creating a loop-free topology", "C: Replace routing", "D: Speed up convergence"], correct_answer: "B" },
        { question: "How do you secure management interfaces on network devices?", options: ["A: Expose them to the public internet", "B: Use management VLANs, ACLs, SSH, and jump hosts", "C: Use Telnet", "D: Disable logging"], correct_answer: "B" },
        { question: "What's the impact of MTU mismatch on network performance?", options: ["A: No impact", "B: Causes fragmentation or dropped packets leading to performance issues", "C: Improves throughput", "D: Only affects wireless"], correct_answer: "B" },
        { question: "Why is time synchronization important in distributed network logging?", options: ["A: It isn't", "B: Correlating events requires synchronized timestamps for troubleshooting and security forensics", "C: It only affects NTP servers", "D: It slows systems"], correct_answer: "B" },
        { question: "Explain how VRF provides multi-tenancy on the same physical router.", options: ["A: VRF duplicates hardware", "B: Virtual Routing and Forwarding creates separate routing tables per tenant", "C: VRF is a firewall feature", "D: It only works on switches"], correct_answer: "B" },
        { question: "What is link-state routing and how does it differ from distance-vector?", options: ["A: Link-state floods full topology and computes shortest paths; distance-vector shares distance vectors with neighbors", "B: They are identical", "C: Distance-vector scales better always", "D: Link-state is used only in BGP"], correct_answer: "A" },
        { question: "How can you mitigate DDoS attacks at network edge?", options: ["A: Accept all traffic", "B: Rate-limiting, sinkholing, scrubbing services, and filtering suspicious patterns at edge", "C: Disable routing", "D: Use plain NAT only"], correct_answer: "B" }
    ],
    "Game Development": [
        { question: "What are the trade-offs between using a fixed timestep vs variable timestep for game physics?", options: ["A: Fixed timestep simpler and deterministic; variable can produce instability but smoother rendering", "B: Variable is deterministic", "C: Fixed skips rendering", "D: No differences"], correct_answer: "A" },
        { question: "Explain spatial partitioning and why it's important in collision detection.", options: ["A: It's irrelevant", "B: Divides space (quadtrees, BVH) to reduce collision checks and improve performance", "C: Slows down physics", "D: Only used in 2D"], correct_answer: "B" },
        { question: "How does frustum culling improve rendering performance?", options: ["A: It increases draw calls", "B: It skips rendering objects outside the camera view to save GPU work", "C: It replaces occlusion culling", "D: It's only for shadows"], correct_answer: "B" },
        { question: "When is it appropriate to use baked lighting over real-time lighting?", options: ["A: For static scenes to gain performance and quality; dynamic scenes need real-time lighting", "B: Baked is always better", "C: Real-time is for mobile only", "D: Baked removes textures"], correct_answer: "A" },
        { question: "What is GPGPU programming and how can it be used in games?", options: ["A: GPU can't be programmed", "B: Using GPU for general computation (compute shaders) to accelerate physics or particle systems", "C: It's only for rendering UI", "D: Replaces CPU entirely"], correct_answer: "B" },
        { question: "Describe the use of deterministic lockstep networking for RTS games.", options: ["A: It relies on synchronized game state updates and input exchange to avoid authoritative server; requires determinism", "B: It sends full game state every frame", "C: It's only for single-player", "D: It uses UDP to guarantee delivery"], correct_answer: "A" },
        { question: "Why are asset pipelines important in larger game teams?", options: ["A: They aren't", "B: Manage conversion, compression, and platform-specific builds to maintain consistency and performance", "C: They slow iterations", "D: Replace source control"], correct_answer: "B" },
        { question: "What is the advantage of ECS (Entity Component System) architecture?", options: ["A: Tighter coupling", "B: Data-driven design that improves cache performance and flexibility for large numbers of entities", "C: Only used in mobile games", "D: Makes debugging trivial"], correct_answer: "B" },
        { question: "How can you reduce input latency for competitive games?", options: ["A: Increase frame time", "B: Use techniques like client-side prediction, lower render latency, and tick-rate tuning", "C: Disable interpolation", "D: Use HTTP for networking"], correct_answer: "B" },
        { question: "Explain occlusion culling vs frustum culling.", options: ["A: They are the same", "B: Frustum culling removes objects outside camera; occlusion culling also excludes objects hidden by other geometry", "C: Occlusion only uses CPU", "D: Frustum is for AI"], correct_answer: "B" },
        { question: "Why might you use LOD (Level of Detail) meshes?", options: ["A: To increase triangle count", "B: Reduce polygon complexity for distant objects to save GPU and memory", "C: Replace textures", "D: Improve physics accuracy"], correct_answer: "B" },
        { question: "What is haptic feedback tuning and why does it matter?", options: ["A: It's unnecessary", "B: Adjusting vibration intensity and patterns improves player experience and communication", "C: It's only for accessibility", "D: It reduces battery life"], correct_answer: "B" },
        { question: "How do you approach multiplayer matchmaking fairness?", options: ["A: Random pairing", "B: Use skill rating systems, latency checks, and region-based pools", "C: Always match rookies vs experts", "D: Prioritize coin payments"], correct_answer: "B" },
        { question: "What are common causes of frame drops on consoles?", options: ["A: Unlimited CPU", "B: Asset streaming spikes, GC pauses, or unbounded draw calls", "C: Too few textures", "D: Low-quality audio"], correct_answer: "B" },
        { question: "Explain how bloom post-processing works at a high level.", options: ["A: It reduces brightness", "B: Extracts bright regions, blurs them, and blends back to simulate light bleeding", "C: It's a physics effect", "D: Only used in 2D games"], correct_answer: "B" }
    ],
    "Quantum Computing": [
        { question: "What is quantum superposition and how does it differ from classical bits?", options: ["A: It's the same as bits", "B: Qubits can be in linear combinations of states, enabling parallelism", "C: Qubits store multiple bits in memory only", "D: It guarantees faster algorithms always"], correct_answer: "B" },
        { question: "Explain decoherence and why it's a challenge for quantum computers.", options: ["A: It's unrelated", "B: Interaction with environment destroys quantum states, causing errors", "C: It speeds up computation", "D: It only affects classical systems"], correct_answer: "B" },
        { question: "What is quantum entanglement used for in algorithms?", options: ["A: For classical caching", "B: Create correlated states that enable protocols like teleportation and speedups in some algorithms", "C: Replace CPUs", "D: For file storage"], correct_answer: "B" },
        { question: "How does the quantum Fourier transform aid factoring algorithms?", options: ["A: It's not used", "B: It transforms basis states to reveal periodicity exploited in Shor's algorithm", "C: It compresses quantum data", "D: It measures qubits"], correct_answer: "B" },
        { question: "Why are error-correcting codes different in quantum systems?", options: ["A: There are no errors in quantum systems", "B: They must preserve quantum information without cloning, using entangled redundancy (e.g., surface codes)", "C: Classical ECCs work unchanged", "D: Quantum codes only exist in theory"], correct_answer: "B" },
        { question: "What is a qubit's Bloch sphere representation?", options: ["A: It's a disk", "B: A geometric representation of a qubit's pure state as a point on the sphere", "C: Only for multi-qubit systems", "D: Represents classical probability"], correct_answer: "B" },
        { question: "Explain why readout errors are problematic in near-term quantum devices.", options: ["A: Readout is always perfect", "B: Measurement can be noisy, causing incorrect classical outputs; requires calibration and mitigation", "C: Readout errors only affect analog signals", "D: They improve fidelity"], correct_answer: "B" },
        { question: "Describe the difference between gate-based and annealing quantum computers.", options: ["A: They are identical", "B: Gate-based uses quantum gates and circuits; annealers use energy minimization to solve optimization problems", "C: Annealers run classical code", "D: Gate-based is obsolete"], correct_answer: "B" },
        { question: "What does 'quantum advantage' mean?", options: ["A: Quantum always beats classical", "B: A quantum device solves a practical problem faster or more efficiently than classical counterparts", "C: It's marketing only", "D: It requires infinite qubits"], correct_answer: "B" },
        { question: "Why is connectivity between qubits important?", options: ["A: It's not", "B: Limited connectivity affects which gates can be executed directly and impacts compilation and performance", "C: It only affects memory", "D: It's only for superconducting qubits"], correct_answer: "B" },
        { question: "How do you benchmark a quantum device's performance?", options: ["A: Only with unit tests", "B: Use metrics like fidelity, T1/T2 times, and randomized benchmarking", "C: Use CPU clock speed", "D: Only by problem size"], correct_answer: "B" },
        { question: "What's the role of error mitigation in NISQ devices?", options: ["A: It eliminates errors completely", "B: Techniques like extrapolation and zero-noise amplification reduce impact without full error correction", "C: It's unnecessary", "D: It replaces hardware improvements"], correct_answer: "B" },
        { question: "Explain why gate depth matters in quantum algorithms.", options: ["A: Deeper circuits always improve results", "B: Greater depth increases exposure to decoherence and errors; shorter depth is preferable on NISQ devices", "C: Depth only affects classical post-processing", "D: Depth is unrelated to qubit count"], correct_answer: "B" },
        { question: "What is amplitude amplification and how is it used?", options: ["A: It reduces amplitudes", "B: Amplifies probability of desired states (e.g., Grover's algorithm) to increase success probability", "C: It's a hardware technique", "D: It duplicates qubits"], correct_answer: "B" },
        { question: "Why can't you clone arbitrary quantum states?", options: ["A: You can clone them", "B: The no-cloning theorem forbids copying unknown quantum states, affecting error correction strategies", "C: It's only a practical limit", "D: It applies only to classical bits"], correct_answer: "B" }
    ]
    ,
    "Data Structures & Algos (DSA)": [
        { question: "What's the worst-case time complexity of quicksort and how can it be mitigated?", options: ["A: O(n) rarely", "B: O(n^2); mitigate with randomized pivots or introsort", "C: O(log n)", "D: O(n log n) always"], correct_answer: "B" },
        { question: "Explain when to use a trie over a hash table.", options: ["A: Tries are slower", "B: Tries are good for prefix searches and ordered traversal with predictable memory trade-offs", "C: Tries replace databases", "D: Hash tables are for graphs only"], correct_answer: "B" },
        { question: "What is amortized analysis and an example of its use?", options: ["A: Average-case only", "B: It averages operation costs over a sequence; e.g., dynamic array resizing is amortized O(1)", "C: Worst-case per op", "D: Only for recursive functions"], correct_answer: "B" },
        { question: "When is Dijkstra's algorithm inappropriate?", options: ["A: For positive-weighted graphs", "B: When negative edge weights exist; use Bellman-Ford instead", "C: For unweighted graphs", "D: For trees only"], correct_answer: "B" },
        { question: "Why choose an adjacency list over adjacency matrix?", options: ["A: Matrix uses less memory for sparse graphs", "B: Lists are more memory-efficient for sparse graphs and faster to iterate neighbors", "C: Matrices are always faster", "D: Lists don't support weights"], correct_answer: "B" },
        { question: "Explain the use of a Fenwick tree (Binary Indexed Tree).", options: ["A: To sort arrays", "B: Efficient prefix-sum queries and point updates in O(log n)", "C: Graph traversal", "D: String matching"], correct_answer: "B" },
        { question: "What does 'stable sort' mean and when does it matter?", options: ["A: Sorts never change order", "B: Keeps equal-keyed elements in original order; matters for multi-key sorting", "C: It's slower always", "D: Only for integers"], correct_answer: "B" },
        { question: "How does A* search differ from Dijkstra?", options: ["A: A* uses heuristic to guide search and can be faster with admissible heuristics", "B: They are identical", "C: Dijkstra uses heuristics", "D: A* is only for trees"], correct_answer: "A" },
        { question: "When are skip lists a good alternative?", options: ["A: Never", "B: When you need probabilistic balanced ordered sets with simpler implementation than balanced trees", "C: For immutable structures only", "D: For dense matrices"], correct_answer: "B" },
        { question: "What's the idea behind union-find with path compression?", options: ["A: It slows unions", "B: Flattens tree structure to almost amortized O(1) for finds and unions", "C: Only for BFS", "D: Replaces hash maps"], correct_answer: "B" },
        { question: "Why is tail recursion optimization useful?", options: ["A: It increases stack usage", "B: Converts recursion into iteration to avoid stack overflow and improve performance", "C: It's only a compiler bug", "D: It prevents memoization"], correct_answer: "B" },
        { question: "Explain bloom filters and their trade-offs.", options: ["A: Exact set membership", "B: Probabilistic membership with false positives but no false negatives; very space-efficient", "C: Use lots of memory", "D: Replace SQL indexes"], correct_answer: "B" },
        { question: "How does the Rabin-Karp algorithm speed up string search?", options: ["A: By brute force", "B: Uses rolling hash to detect potential matches quickly", "C: It compares all substrings", "D: It's only for regex"], correct_answer: "B" },
        { question: "What is the purpose of topological sort?", options: ["A: Sort numbers", "B: Linearize a DAG respecting dependencies (e.g., build order)", "C: For cyclic graphs", "D: For shortest paths"], correct_answer: "B" },
        { question: "When is dynamic programming appropriate?", options: ["A: Only for greedy problems", "B: When problem has overlapping subproblems and optimal substructure", "C: For hashing", "D: For sorting"], correct_answer: "B" },
        { question: "What's the time complexity of building a heap from an unsorted array?", options: ["A: O(n log n)", "B: O(n)", "C: O(log n)", "D: O(n^2)"], correct_answer: "B" },
        { question: "Explain the sliding window technique and a use-case.", options: ["A: For graph coloring", "B: Maintain a window over data for efficient subarray problems like max/subarray sums", "C: Only for sorting", "D: For recursion"], correct_answer: "B" },
        { question: "Why use memoization over plain recursion?", options: ["A: It makes code slower", "B: Stores results to avoid repeated computation, converting exponential to polynomial time in many cases", "C: It increases time complexity", "D: Only for IO-bound tasks"], correct_answer: "B" },
        { question: "What is the complexity benefit of using a deque for sliding-window max?", options: ["A: O(n^2)", "B: O(n) by maintaining candidates in amortized constant time per element", "C: O(log n)", "D: O(1) total"], correct_answer: "B" }
    ],
    "DevOps & Cloud": [
        { question: "What are blue-green deployments and their main benefit?", options: ["A: They slow deployments", "B: Maintain two production environments to switch traffic with minimal downtime and easy rollback", "C: Require manual DNS changes only", "D: Replace CI/CD"], correct_answer: "B" },
        { question: "Explain immutable infrastructure and why it's useful.", options: ["A: Mutable servers updated in place", "B: Replace servers instead of mutating, improving reproducibility and rollback", "C: Only for desktop apps", "D: Makes deployments manual"], correct_answer: "B" },
        { question: "When would you choose serverless over containers?", options: ["A: For long-running jobs only", "B: For event-driven, short-lived workloads where operational overhead should be minimal", "C: Serverless always cheaper", "D: Never"], correct_answer: "B" },
        { question: "What is the purpose of IaC (Infrastructure as Code)?", options: ["A: Write configs by hand", "B: Declaratively provision and version infrastructure to ensure reproducibility", "C: Only for documentation", "D: Replace monitoring"], correct_answer: "B" },
        { question: "How does horizontal scaling differ from vertical scaling?", options: ["A: Horizontal means scaling up a single machine", "B: Horizontal adds more machines (scale out); vertical increases resources on one machine (scale up)", "C: They are the same", "D: Only DBs use horizontal"], correct_answer: "B" },
        { question: "Explain the role of a service mesh in microservices architecture.", options: ["A: It replaces services", "B: Provides observability, traffic management, and security at the networking layer (sidecars)", "C: Only for monoliths", "D: For storage"], correct_answer: "B" },
        { question: "What does 'cattle vs pets' mean for server management?", options: ["A: Naming conventions", "B: Treat servers as disposable (cattle) rather than unique (pets) to improve automation and recovery", "C: Only for databases", "D: It's a security practice"], correct_answer: "B" },
        { question: "Why is container image vulnerability scanning important?", options: ["A: It's optional", "B: Detects known CVEs in images before deployment to reduce risk", "C: Slows CI significantly", "D: Only for base images"], correct_answer: "B" },
        { question: "How would you design a zero-downtime database migration?", options: ["A: Drop columns immediately", "B: Use backward-compatible changes, dual-write patterns, and phased rollouts", "C: Shutdown services", "D: Rely on manual scripts only"], correct_answer: "B" },
        { question: "What is chaos engineering and its goal?", options: ["A: Break production randomly", "B: Intentionally inject failures in controlled experiments to improve system resilience", "C: Replace testing", "D: Only for staging"], correct_answer: "B" },
        { question: "Explain the difference between CI and CD pipelines in practice.", options: ["A: CI deploys to prod", "B: CI builds/tests code; CD automates delivery to environments and possibly production", "C: CD is optional testing", "D: CI is only for frontend"], correct_answer: "B" },
        { question: "How does autoscaling work and what metrics are common triggers?", options: ["A: It's manual", "B: Automatically adjusts capacity based on metrics like CPU, memory, queue length, or custom business metrics", "C: Only time-based scaling", "D: Only use latency"], correct_answer: "B" },
        { question: "Why isolate build artifacts in a registry?", options: ["A: For performance only", "B: Ensures reproducible deployments, access control, and traceability of release artifacts", "C: Makes builds slower", "D: Only used in monorepos"], correct_answer: "B" },
        { question: "What's the role of an observability pipeline (logs -> metrics -> traces)?", options: ["A: It's unnecessary", "B: Collect, enrich, and route telemetry for alerting, debugging, and capacity planning", "C: Only for security teams", "D: It stores backups"], correct_answer: "B" },
        { question: "How do you manage secrets in a cloud-native environment?", options: ["A: Commit them to git", "B: Use vault solutions, KMS, or cloud secret managers with rotation and RBAC", "C: Store in plaintext files", "D: Email them"], correct_answer: "B" },
        { question: "Explain canary deployments and how to determine success criteria.", options: ["A: Release to all users", "B: Deploy to a small percentage, monitor key metrics and roll back if anomalies detected", "C: Only test UI", "D: Always manual"], correct_answer: "B" },
        { question: "What is the importance of SLAs for cloud providers?", options: ["A: Marketing only", "B: Define uptime and compensation guarantees guiding architecture and redundancy decisions", "C: Replace SLOs", "D: Only for internal teams"], correct_answer: "B" }
    ],
    "Cyber Security": [
        { question: "What's the difference between symmetric and asymmetric encryption and a use-case for each?", options: ["A: They are same", "B: Symmetric uses shared keys for bulk encryption; asymmetric for key exchange and signatures", "C: Asymmetric is faster", "D: Symmetric used for hashing"], correct_answer: "B" },
        { question: "Explain the principle of least privilege and its importance.", options: ["A: Give admin to everyone", "B: Grant only necessary permissions to reduce attack surface and limit blast radius", "C: It's only for firewalls", "D: It slows devs"], correct_answer: "B" },
        { question: "How does SQL injection occur and one primary mitigation?", options: ["A: It's a browser bug", "B: Occurs when inputs are concatenated into queries; use parameterized queries/ORMs to mitigate", "C: Only affects NoSQL", "D: Use regex only"], correct_answer: "B" },
        { question: "What is XSS and how can content security policy (CSP) help?", options: ["A: XSS is a network attack", "B: Cross-site scripting injects scripts; CSP restricts allowed sources to reduce risk", "C: CSP increases XSS", "D: XSS only affects mobile apps"], correct_answer: "B" },
        { question: "Why is multi-factor authentication (MFA) effective?", options: ["A: It's inconvenient", "B: Adds independent authentication factors reducing impact of credential theft", "C: Replaces passwords", "D: Only for admins"], correct_answer: "B" },
        { question: "Describe certificate pinning and when it's useful.", options: ["A: It disables TLS", "B: Bind a service to specific TLS certificates to prevent MitM even if a CA is compromised", "C: Only for SMTP", "D: Replaces CA system"], correct_answer: "B" },
        { question: "What is threat modeling and a common framework?", options: ["A: It's for marketing", "B: Identifies potential threats and mitigations; STRIDE is a commonly used framework", "C: It's only for pen testers", "D: It replaces pen testing"], correct_answer: "B" },
        { question: "How do you securely store passwords?", options: ["A: Plaintext in DB", "B: Use slow salted hashes like bcrypt/argon2 with per-user salts", "C: Encrypt with reversible keys only", "D: Store in cookies"], correct_answer: "B" },
        { question: "Explain the purpose of a web application firewall (WAF).", options: ["A: It's a load balancer", "B: Filters and blocks malicious HTTP traffic patterns to protect web applications", "C: Replaces TLS", "D: Only for databases"], correct_answer: "B" },
        { question: "What are common indicators of compromise (IoCs)?", options: ["A: High CPU only", "B: Unusual outbound traffic, unexpected processes, altered files, sudden privilege escalations", "C: Low disk only", "D: Regular backups"], correct_answer: "B" },
        { question: "Why is secure code review important in SDLC?", options: ["A: It slows delivery", "B: Finds vulnerabilities early reducing cost and severity of fixes", "C: Only for open source", "D: Replaces pen testing"], correct_answer: "B" },
        { question: "How do you mitigate supply-chain attacks?", options: ["A: Trust everything", "B: Validate dependencies, sign artifacts, use SBOMs and minimal permissions for build systems", "C: Only use private repos", "D: Disable CI"], correct_answer: "B" },
        { question: "Explain the difference between vulnerability scanning and penetration testing.", options: ["A: They are identical", "B: Scans automate vulnerability discovery; pentests are manual, adversary-like exercises for deeper validation", "C: Scans are manual", "D: Pentests replace monitoring"], correct_answer: "B" },
        { question: "What is lateral movement in an intrusion scenario?", options: ["A: Moving data only", "B: Attackers moving across a network to access additional targets after initial compromise", "C: Only about physical breaches", "D: It's a DNS term"], correct_answer: "B" },
        { question: "Why is network segmentation useful for security?", options: ["A: It complicates routing", "B: Limits attack surface and contains breaches to segments", "C: It replaces encryption", "D: Only for cloud"], correct_answer: "B" }
    ],
    "Artificial Intelligence": [
        { question: "What is overfitting and a practical technique to prevent it?", options: ["A: When model generalizes well", "B: Model fits noise; use regularization, cross-validation, or more data", "C: Only in unsupervised learning", "D: It improves accuracy always"], correct_answer: "B" },
        { question: "Explain bias-variance tradeoff in model selection.", options: ["A: Bias and variance are unrelated", "B: Tradeoff between underfitting (high bias) and overfitting (high variance); choose model complexity accordingly", "C: Only for clustering", "D: Only for deep learning"], correct_answer: "B" },
        { question: "Why is data quality often more important than model choice?", options: ["A: Models fix bad data", "B: Poor data leads to garbage-in-garbage-out; cleaning and labeling quality often yield bigger gains", "C: Data quality irrelevant", "D: Only feature scaling matters"], correct_answer: "B" },
        { question: "What is transfer learning and when is it useful?", options: ["A: Copying models illegally", "B: Reuse pretrained models and fine-tune on smaller target datasets to save compute and improve performance", "C: Only for text", "D: It reduces model capacity"], correct_answer: "B" },
        { question: "Describe explainability techniques for ML models.", options: ["A: They don't exist", "B: SHAP, LIME, feature importance and surrogate models help interpret predictions", "C: Only for decision trees", "D: Replace testing"], correct_answer: "B" },
        { question: "How does class imbalance affect training and a mitigation?", options: ["A: It helps generalization", "B: Leads to biased predictions; mitigate with resampling, class weights, or focal loss", "C: Only for regression", "D: Use smaller batch sizes"], correct_answer: "B" },
        { question: "What's the purpose of a validation set?", options: ["A: For deployment", "B: Tune hyperparameters and evaluate generalization during training without touching test set", "C: It's same as test set", "D: Only for unsupervised"], correct_answer: "B" },
        { question: "Why monitor model drift in production?", options: ["A: Models never change", "B: Data distribution may shift, degrading performance; monitor and retrain when drift occurs", "C: Only hardware matters", "D: It only affects latency"], correct_answer: "B" },
        { question: "Explain the difference between supervised and self-supervised learning.", options: ["A: They are the same", "B: Supervised uses labeled pairs; self-supervised creates proxy tasks from unlabeled data to learn representations", "C: Self-supervised needs labels", "D: Only for images"], correct_answer: "B" },
        { question: "What are privacy concerns with ML models and one mitigation?", options: ["A: No concerns", "B: Models can leak training data; use differential privacy or federated learning", "C: Only deploy on cloud", "D: Encrypt weights only"], correct_answer: "B" },
        { question: "How would you evaluate a generative model qualitatively?", options: ["A: Only use accuracy", "B: Use human evaluation, diversity metrics, and domain-specific checks (e.g., BLEU, FID)", "C: Use only loss", "D: It's not possible"], correct_answer: "B" },
        { question: "Why is hyperparameter tuning important and common methods?", options: ["A: It isn't", "B: It significantly affects model performance; use grid search, random search, or Bayesian optimization", "C: Only manual tuning", "D: Only for SVMs"], correct_answer: "B" },
        { question: "What is label leakage and why is it harmful?", options: ["A: Helpful for training", "B: When training features contain information that won't be available at prediction time, causing over-optimistic performance", "C: Only for test sets", "D: Only for small datasets"], correct_answer: "B" },
        { question: "Explain model ensembling and one trade-off.", options: ["A: It reduces compute", "B: Combine multiple models to improve accuracy at the cost of inference complexity and latency", "C: Always worse", "D: Replace data augmentation"], correct_answer: "B" }
    ],
    "Web Technologies (HTML/CSS/JS)": [
        { question: "Explain critical rendering path optimization for faster page loads.", options: ["A: Load everything synchronously", "B: Minimize render-blocking resources, inline critical CSS, and defer non-critical JS", "C: Always inline all scripts", "D: Use iframes only"], correct_answer: "B" },
        { question: "Why is CORS necessary and a common pitfall?", options: ["A: It's for styling", "B: Browsers restrict cross-origin requests for security; misconfigured CORS can expose data or break APIs", "C: It's only for mobile", "D: It disables cookies"], correct_answer: "B" },
        { question: "How does progressive hydration improve large SPA performance?", options: ["A: It degrades UX", "B: Hydrates interactive parts progressively to reduce time-to-interactive for large pages", "C: It's server-only", "D: It removes CSS"], correct_answer: "B" },
        { question: "What's the difference between event delegation and attaching listeners per element?", options: ["A: Delegation attaches fewer listeners at parent to handle many children; better memory and dynamic elements support", "B: They are identical", "C: Delegation is deprecated", "D: Per-element is always better"], correct_answer: "A" },
        { question: "When should you use Web Workers?", options: ["A: For DOM manipulation", "B: Offload CPU-heavy tasks to background threads to avoid blocking the main thread", "C: Only for network requests", "D: They replace servers"], correct_answer: "B" },
        { question: "Explain how service workers enable offline-first apps.", options: ["A: They are server-side", "B: Intercept network requests and serve cached responses to enable offline capabilities and faster loads", "C: Only for push notifications", "D: They are deprecated"], correct_answer: "B" },
        { question: "Why is accessibility (a11y) important and one best practice?", options: ["A: It's optional", "B: Ensures inclusive UX; use semantic HTML and ARIA roles appropriately", "C: Only for marketing", "D: It slows development"], correct_answer: "B" },
        { question: "What are progressive web apps (PWAs) and a key benefit?", options: ["A: They are native apps", "B: Web apps with installability, offline support, and improved engagement", "C: Only for Android", "D: They require app stores"], correct_answer: "B" },
        { question: "Explain reflow vs repaint and why minimizing reflow matters.", options: ["A: They are the same", "B: Reflow recalculates layout and is more expensive; minimizing layout changes improves performance", "C: Repaint is heavier than reflow", "D: Only affects CSS"], correct_answer: "B" },
        { question: "How do you secure client-side state and what shouldn't be stored in localStorage?", options: ["A: Store tokens in localStorage always", "B: Avoid storing sensitive tokens in localStorage; use secure cookies or encrypted storage and apply CSRF protections", "C: localStorage is encrypted", "D: It's only for images"], correct_answer: "B" },
        { question: "When to use CSS containment and its benefit?", options: ["A: It's deprecated", "B: Limits browser work for layout/paint to isolated parts, improving performance for complex pages", "C: It increases reflow", "D: Only for print"], correct_answer: "B" },
        { question: "Explain the concept of same-origin policy (SOP).", options: ["A: It's about origins only in DB", "B: Browser security model restricting scripts from accessing resources from different origins unless allowed", "C: It applies only to images", "D: It disables cookies"], correct_answer: "B" },
        { question: "What is tree-shaking in bundlers?", options: ["A: Removing all comments", "B: Eliminate unused code paths to reduce bundle size using static analysis", "C: Minify CSS only", "D: It's runtime only"], correct_answer: "B" }
    ],
    "Database Systems (SQL/NoSQL)": [
        { question: "When should you prefer a partitioned (sharded) database?", options: ["A: For small datasets only", "B: When dataset and traffic exceed single-node capacity and horizontal scaling is needed", "C: It simplifies transactions", "D: Only for OLAP"], correct_answer: "B" },
        { question: "Explain ACID vs BASE in distributed databases.", options: ["A: They are identical", "B: ACID emphasizes strong consistency and transactions; BASE favors availability and eventual consistency", "C: BASE enforces strict isolation", "D: ACID is only for NoSQL"], correct_answer: "B" },
        { question: "What is multiversion concurrency control (MVCC)?", options: ["A: Single version only", "B: Keeps multiple versions of data to allow readers without blocking writers and improve concurrency", "C: Only for filesystems", "D: It prevents replication"], correct_answer: "B" },
        { question: "How do secondary indexes affect write performance?", options: ["A: They speed up writes", "B: Add overhead on writes due to extra index updates; trade-off for faster reads", "C: No effect", "D: Only for in-memory DBs"], correct_answer: "B" },
        { question: "Why is choosing the right consistency model important for distributed apps?", options: ["A: It's not", "B: Impacts UX, correctness, and architecture (strong vs eventual consistency trade-offs)", "C: Only for caching", "D: It only affects backups"], correct_answer: "B" },
        { question: "Explain write-ahead logging (WAL) and its purpose.", options: ["A: It's for reads only", "B: Persist changes before applying to data files to ensure durability and enable crash recovery", "C: It replaces backups", "D: Only for NoSQL"], correct_answer: "B" },
        { question: "What is a materialized view and when is it useful?", options: ["A: A view that never stores data", "B: Precomputed view stored for faster complex queries at cost of maintenance", "C: Only for normalization", "D: For schema migrations only"], correct_answer: "B" },
        { question: "How does eventual consistency affect conflict resolution?", options: ["A: No conflicts occur", "B: Conflicts may need application-level resolution strategies like last-write-wins or CRDTs", "C: DB handles all conflicts automatically", "D: It only affects transactions"], correct_answer: "B" },
        { question: "Why use connection pooling and what problem does it solve?", options: ["A: It slows down DB", "B: Reuse DB connections to avoid expensive establishment overhead and manage concurrency", "C: Only for NoSQL", "D: Replace transactions"], correct_answer: "B" },
        { question: "Explain the role of an OLAP cube compared to OLTP workloads.", options: ["A: They are the same", "B: OLAP is for analytical queries over large datasets; OLTP handles transactional operations", "C: OLTP is for analytics", "D: Only for backups"], correct_answer: "B" }
    ]
};

// --- New Language Question Banks ---
LOCAL_QUESTIONS["C Programming"] = [
    { question: "Which storage class in C persists across function calls and is local to the translation unit?", options: ["A: auto", "B: static", "C: register", "D: extern"], correct_answer: "B" },
    { question: "What is a common cause of undefined behavior in C?", options: ["A: Using initialized variables", "B: Accessing freed memory (use-after-free)", "C: Using const qualifiers", "D: Returning constants"], correct_answer: "B" },
    { question: "Which function is used to dynamically allocate memory in C?", options: ["A: new", "B: malloc", "C: alloc", "D: create"], correct_answer: "B" },
    { question: "Why is it dangerous to use strcpy without checks?", options: ["A: It's thread-unsafe", "B: Buffer overflow risk if destination not large enough", "C: It encrypts data", "D: It frees memory"], correct_answer: "B" },
    { question: "Which header provides the printf function?", options: ["A: stdlib.h", "B: stdio.h", "C: string.h", "D: unistd.h"], correct_answer: "B" },
    { question: "What does undefined behavior imply for compilers?", options: ["A: Predictable output", "B: Compiler may optimize assuming UB never occurs, causing surprising behavior", "C: Errors at runtime always", "D: Warnings only"], correct_answer: "B" },
    { question: "How do you prevent memory leaks in C?", options: ["A: Avoid malloc", "B: Ensure every malloc has a matching free and use tools like Valgrind", "C: Use garbage collector", "D: Use exceptions"], correct_answer: "B" },
    { question: "What is pointer arithmetic dependent on?", options: ["A: Value stored", "B: Size of pointed type", "C: File descriptor", "D: Heap size"], correct_answer: "B" },
    { question: "Why use volatile keyword?", options: ["A: For optimization hints", "B: Prevent compiler from optimizing access to memory that may change externally (e.g., hardware registers)", "C: To allocate memory", "D: For thread safety only"], correct_answer: "B" },
    { question: "Which operator has higher precedence: ++ (postfix) or * (dereference)?", options: ["A: *", "B: ++ (postfix)", "C: They are equal", "D: Depends on compiler"], correct_answer: "B" }
];

LOCAL_QUESTIONS["C++ Programming"] = [
    { question: "What is the rule of three/five/zero in C++?", options: ["A: It's a math rule", "B: If a class defines destructor, copy constructor, or copy assignment, it likely needs move ops too; manage resource semantics", "C: For loops", "D: For memory alignment"], correct_answer: "B" },
    { question: "Why prefer smart pointers (unique_ptr/shared_ptr) over raw pointers?", options: ["A: They are slower always", "B: They provide RAII automatic memory management and prevent leaks", "C: They disable polymorphism", "D: Only for UI"], correct_answer: "B" },
    { question: "What does RAII stand for and why is it useful?", options: ["A: Random Access Indexing Interface", "B: Resource Acquisition Is Initialization; ensures resources are released in destructors", "C: Runtime AI", "D: Not a C++ concept"], correct_answer: "B" },
    { question: "When would you use move semantics?", options: ["A: For small ints", "B: When transferring ownership to avoid expensive copies", "C: To copy-shared resources", "D: For arrays only"], correct_answer: "B" },
    { question: "What is undefined behavior caused by virtual inheritance misuse?", options: ["A: It never happens", "B: Diamond problem and slicing may lead to UB if not designed correctly", "C: Only link-time error", "D: Only in templates"], correct_answer: "B" },
    { question: "What is object slicing?", options: ["A: Cutting arrays", "B: When assigning derived to base by value loses derived parts; use pointers/references", "C: It speeds copies", "D: Only in C"], correct_answer: "B" },
    { question: "Why use constexpr?", options: ["A: It's deprecated", "B: Enables compile-time computation for performance and correctness", "C: For debugging only", "D: For exceptions"], correct_answer: "B" },
    { question: "Explain the difference between virtual and non-virtual methods.", options: ["A: Virtual methods support polymorphism via vtable; non-virtual don't", "B: Non-virtual are slower", "C: They are identical", "D: Virtual only for static classes"], correct_answer: "A" },
    { question: "How do templates affect compile times and binary size?", options: ["A: They reduce both", "B: Templates can increase compile time and code bloat due to instantiations", "C: No impact", "D: Only runtime effect"], correct_answer: "B" },
    { question: "When to use noexcept?", options: ["A: Always", "B: When function is guaranteed not to throw to enable optimizations and stronger guarantees", "C: For deprecated functions", "D: Only for constructors"], correct_answer: "B" }
];

LOCAL_QUESTIONS["Java"] = [
    { question: "What is the difference between JDK, JRE, and JVM?", options: ["A: They are the same", "B: JVM runs bytecode; JRE bundles JVM and runtime libs; JDK includes tools to build Java apps", "C: JRE compiles code", "D: JDK only for deployment"], correct_answer: "B" },
    { question: "When should you use StringBuilder over String in Java?", options: ["A: For immutable data", "B: For many concatenations to avoid creating many String objects", "C: Only for IO", "D: They are identical"], correct_answer: "B" },
    { question: "Explain volatile in Java.", options: ["A: For optimization only", "B: Ensures reads/writes go to main memory and provides visibility across threads (but not atomicity)", "C: It's deprecated", "D: It's a synchronization primitive"], correct_answer: "B" },
    { question: "What are checked vs unchecked exceptions?", options: ["A: Checked must be declared/handled; unchecked extend RuntimeException and need not be declared", "B: They are identical", "C: Only runtime errors", "D: Only for IO"], correct_answer: "A" },
    { question: "Why use concurrent collections (e.g., ConcurrentHashMap)?", options: ["A: They are single-threaded", "B: Provide thread-safe operations with better concurrency than synchronized structures", "C: Slower always", "D: Only for GUIs"], correct_answer: "B" },
    { question: "Explain Java memory model and safe publication briefly.", options: ["A: It doesn't exist", "B: Rules exist for visibility and ordering; safe publication ensures object references are visible to other threads correctly", "C: It's only for GC", "D: Only for JNI"], correct_answer: "B" },
    { question: "What is a classloader and why is it important?", options: ["A: It loads images", "B: Responsible for loading classes and isolating namespaces (important for app servers/plugins)", "C: Only for desktop apps", "D: For database connections"], correct_answer: "B" },
    { question: "When is finalizer deprecated and why?", options: ["A: It isn't deprecated", "B: finalizers are unpredictable and can cause resource issues; prefer try-with-resources and cleaners", "C: Only for performance", "D: For serialization"], correct_answer: "B" },
    { question: "How does garbage collection affect pause times and throughput?", options: ["A: No effect", "B: Different collectors trade off pause times and throughput; e.g., G1 aims to reduce pause times", "C: GC is manual", "D: Only affects memory only"], correct_answer: "B" },
    { question: "Why use Executors framework over raw Threads?", options: ["A: It's slower", "B: Executors manage pools, lifecycle, and task scheduling for reliability and efficiency", "C: Only for debugging", "D: Not recommended"], correct_answer: "B" }
];

LOCAL_QUESTIONS["Python"] = [
    { question: "What's the GIL and how does it affect concurrency in CPython?", options: ["A: It's a garbage collector", "B: Global Interpreter Lock prevents multiple native threads executing Python bytecode concurrently, limiting CPU-bound parallelism", "C: Only for IO", "D: It speeds threading"], correct_answer: "B" },
    { question: "Why prefer list comprehension over map/lambda in many Pythonic cases?", options: ["A: They are identical", "B: List comprehensions are often clearer and allow inline conditional logic", "C: Map is faster always", "D: Only for generators"], correct_answer: "B" },
    { question: "How does duck typing influence interface design?", options: ["A: Strict typing only", "B: Focus on behavior rather than explicit types; use protocols/ABC for structure when needed", "C: It's not Pythonic", "D: Use only classes"], correct_answer: "B" },
    { question: "When should you use generators?", options: ["A: For small arrays only", "B: For streaming large sequences where you want lazy evaluation to save memory", "C: Only for IO", "D: They are deprecated"], correct_answer: "B" },
    { question: "What's the difference between shallow and deep copy?", options: ["A: They are same", "B: Shallow copies references for nested objects; deep copy duplicates nested structures", "C: Only for lists", "D: Only for dicts"], correct_answer: "B" },
    { question: "Why is virtualenv/venv important?", options: ["A: It's optional", "B: Isolates project dependencies to avoid conflicts and reproducible environments", "C: Only for production", "D: It's only for Python2"], correct_answer: "B" },
    { question: "Explain context managers and the with-statement use-case.", options: ["A: They are for loops", "B: Provide deterministic setup/teardown for resources (files, locks) via __enter__/__exit__", "C: Only for testing", "D: They slow code"], correct_answer: "B" },
    { question: "How do you profile Python code for hotspots?", options: ["A: Guessing", "B: Use cProfile, line_profiler, or sampling profilers to find hotspots", "C: Only measure runtime", "D: Use print statements only"], correct_answer: "B" },
    { question: "What is PEP8?", options: ["A: A package manager", "B: Style guide for Python code that improves readability and consistency", "C: A testing tool", "D: Only for Django"], correct_answer: "B" },
    { question: "When to use asynchronous programming (async/await)?", options: ["A: For CPU-bound work", "B: For high-concurrency IO-bound workloads where non-blocking code improves throughput", "C: Always", "D: Only for GUIs"], correct_answer: "B" }
];

let currentUser = null;
let quizState = {
    questions: [],
    currentQIndex: 0,
    userAnswers: [], // Array to store the selected letter for each question
    isCheating: false,
};

// --- CORE APPLICATION FUNCTIONS ---

/**
 * Switches the display to the specified screen ID.
 * @param {string} screenId - The ID of the screen element to show.
 */
function showScreen(screenId) {
    SCREENS.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) {
            screen.classList.add('hidden');
        }
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}

/**
 * Updates the user authentication status display.
 */
function updateAuthStatus() {
    const statusElement = document.getElementById('auth-status');
    if (currentUser) {
        statusElement.textContent = `Logged in as: ${currentUser.username}`;
        statusElement.classList.remove('text-accent');
        statusElement.classList.add('text-primary');
    } else {
        statusElement.textContent = 'Please Login or Signup to start.';
        statusElement.classList.remove('text-primary');
        statusElement.classList.add('text-accent');
    }
}

/**
 * Switches the form fields between Login and Signup modes.
 * @param {string} mode - 'login' or 'signup'.
 */
function showAuthMode(mode) {
    const isLogin = mode === 'login';
    const authTitle = document.getElementById('auth-title');
    const authButton = document.getElementById('auth-button');
    const switchLink = document.getElementById('switch-auth');
    const emailGroup = document.getElementById('email-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const emailInput = document.getElementById('email');
    const confirmPassInput = document.getElementById('confirm-password');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    authTitle.textContent = isLogin ? 'Login to Your Grid' : 'Create Your Grid Account';
    authButton.textContent = isLogin ? 'Login' : 'Sign Up';
    switchLink.innerHTML = isLogin ? "Don't have an account? <span class='font-bold'>Sign Up</span>" : "Already have an account? <span class='font-bold'>Login</span>";

    // Toggle required fields and visibility
    if (isLogin) {
        emailGroup.classList.add('hidden');
        confirmPasswordGroup.classList.add('hidden');
        emailInput.removeAttribute('required');
        confirmPassInput.removeAttribute('required');
    } else {
        emailGroup.classList.remove('hidden');
        confirmPasswordGroup.classList.remove('hidden');
        emailInput.setAttribute('required', '');
        confirmPassInput.setAttribute('required', '');
    }
    document.getElementById('auth-message').textContent = '';
    // Clear passwords when switching to avoid confusion
    passwordInput.value = '';
    confirmPassInput.value = '';
}

/**
 * Checks Local Storage for a logged-in user and initializes the app.
 */
function initApp() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthStatus();
        renderCategories();
        showScreen('category-screen');
        requestFullscreen();
    } else {
        showScreen('auth-screen');
        // Ensure auth screen starts in Login mode
        showAuthMode('login');
    }
}

// --- AUTHENTICATION MODULE (Local Storage) ---

/**
 * Handles user login and signup logic.
 * @param {Event} e - Form submission event.
 */
document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const isLogin = document.getElementById('auth-button').textContent.includes('Login');
    const messageElement = document.getElementById('auth-message');
    messageElement.textContent = '';

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isLogin) {
        // LOGIN Logic (Username and Password)
        if (users[username] && users[username].password === password) {
            currentUser = users[username];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthStatus();
            renderCategories();
            showScreen('category-screen');
            requestFullscreen();
        } else {
            messageElement.textContent = 'Invalid username or password.';
        }
    } else {
        // SIGNUP Logic (Email, Username, Password, Confirm Password)
        const email = document.getElementById('email').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (password.length < 6) {
            messageElement.textContent = 'Password must be at least 6 characters long.';
            return;
        }
        if (password !== confirmPassword) {
            messageElement.textContent = 'Passwords do not match.';
            return;
        }
        if (users[username]) {
            messageElement.textContent = 'Username is already taken.';
            return;
        }

        // Successful Signup: isNew: true flag triggers harder questions once
        currentUser = { username: username, email: email, password: password, id: crypto.randomUUID(), isNew: true };
        users[username] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthStatus();
        renderCategories();
        showScreen('category-screen');
        requestFullscreen();
    }
});

/**
 * Toggles between Login and Signup modes on the auth screen.
 */
document.getElementById('switch-auth').addEventListener('click', () => {
    const isLogin = document.getElementById('auth-button').textContent.includes('Login');
    showAuthMode(isLogin ? 'signup' : 'login');
});

/**
 * Handles user logout.
 */
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthStatus();
    showScreen('auth-screen');
    exitFullscreen();
});


// --- CATEGORY SELECTION MODULE ---

/**
 * Renders clickable category cards.
 */
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    const iconColorClasses = ['icon-primary', 'icon-accent', 'icon-emerald', 'icon-amber', 'icon-indigo', 'icon-ink'];
    QUIZ_CATEGORIES.forEach((category, idx) => {
        const button = document.createElement('button');
        button.className = 'bg-card-bg p-4 rounded-lg shadow-sm border border-primary/50 hover:border-primary transition-all duration-200 flex flex-col items-center space-y-2 text-text-color hover:text-primary';

        // Pick a color class by alternating through the palette
        const colorClass = iconColorClasses[idx % iconColorClasses.length];

        // Add shine and hover classes for subtle animation
        // If the category.icon already contains a prefix (e.g., 'fab fa-python' or 'fas fa-code'), use it as-is.
        const iconPrefix = (category.icon && category.icon.indexOf(' ') >= 0) ? category.icon : `fas ${category.icon}`;
        const iconClasses = `${iconPrefix} text-3xl ${colorClass} icon-shine hover-shine icon-hover-zoom`;

        button.innerHTML = `
                    <i class="${iconClasses}"></i>
                    <span class="font-medium text-base text-center">${category.name}</span>
                `;
        button.onclick = () => startQuiz(category.name);
        container.appendChild(button);
    });
}

// --- PROFILE MANAGEMENT ---

function loadProfileData() {
    if (!currentUser) return;
    document.getElementById('profile-username-display').textContent = currentUser.username;
    document.getElementById('profile-email-display').textContent = currentUser.email || '';
    document.getElementById('profile-username').value = currentUser.username;
    document.getElementById('profile-password').value = '';
    document.getElementById('profile-confirm-password').value = '';
    const imgPreview = document.getElementById('profile-image-preview');
    if (currentUser.avatar) {
        imgPreview.src = currentUser.avatar;
    } else {
        imgPreview.src = 'https://via.placeholder.com/80?text=Avatar';
    }
    // Populate full-profile scores (profile screen)
    const scoresList = document.getElementById('profile-scores-list');
    if (scoresList) {
        scoresList.innerHTML = '';
        const scores = (currentUser.scores || []).slice().reverse();
        if (scores.length === 0) {
            scoresList.innerHTML = '<div class="text-sm text-gray-500">No past attempts found.</div>';
        } else {
            scores.forEach(s => {
                const d = new Date(s.timestamp);
                const el = document.createElement('div');
                el.className = 'p-2 border rounded-md bg-white/50';
                el.innerHTML = `<div class="flex justify-between"><div>${s.category}</div><div class="font-bold">${s.score}</div></div><div class="text-xs text-gray-500">${d.toLocaleString()}</div>`;
                scoresList.appendChild(el);
            });
        }
    }
}

// --- INLINE PROFILE HELPERS & EVENT LISTENERS (top-level) ---
function loadInlineProfileData() {
    if (!currentUser) return;
    const usernameDisplay = document.getElementById('inline-profile-username-display');
    const emailDisplay = document.getElementById('inline-profile-email-display');
    const usernameInput = document.getElementById('inline-profile-username');
    const pwdInput = document.getElementById('inline-profile-password');
    const confirmInput = document.getElementById('inline-profile-confirm-password');
    const imgPreview = document.getElementById('inline-profile-image-preview');

    if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
    if (emailDisplay) emailDisplay.textContent = currentUser.email || '';
    if (usernameInput) usernameInput.value = currentUser.username;
    if (pwdInput) pwdInput.value = '';
    if (confirmInput) confirmInput.value = '';
    if (imgPreview) imgPreview.src = currentUser.avatar || 'https://via.placeholder.com/80?text=Avatar';

    const scoresList = document.getElementById('inline-profile-scores-list');
    if (scoresList) {
        scoresList.innerHTML = '';
        const scores = (currentUser.scores || []).slice().reverse();
        if (scores.length === 0) {
            scoresList.innerHTML = '<div class="text-sm text-gray-500">No past attempts found.</div>';
        } else {
            scores.forEach(s => {
                const d = new Date(s.timestamp);
                const el = document.createElement('div');
                el.className = 'p-2 border rounded-md bg-white/50';
                el.innerHTML = `<div class="flex justify-between"><div>${s.category}</div><div class="font-bold">${s.score}</div></div><div class="text-xs text-gray-500">${d.toLocaleString()}</div>`;
                scoresList.appendChild(el);
            });
        }
    }
}

function toggleInlineProfile(open) {
    const panel = document.getElementById('profile-inline');
    if (!panel) return;
    if (open === undefined) open = panel.classList.contains('hidden');
    if (open) {
        if (!currentUser) {
            alert('You must be logged in to view your profile.');
            return;
        }
        loadInlineProfileData();
        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        panel.classList.add('hidden');
    }
}

// Consolidated image change handler (handles both inline and full profile file inputs)
document.addEventListener('change', (e) => {
    if (!e.target) return;
    if (e.target.id === 'inline-profile-image-input' || e.target.id === 'profile-image-input') {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (evt) {
            if (e.target.id === 'inline-profile-image-input') {
                const el = document.getElementById('inline-profile-image-preview');
                if (el) el.src = evt.target.result;
            } else {
                const el = document.getElementById('profile-image-preview');
                if (el) el.src = evt.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
});

// Inline save handler
const inlineSaveBtn = document.getElementById('profile-inline-save');
if (inlineSaveBtn) {
    inlineSaveBtn.addEventListener('click', () => {
        if (!currentUser) return;
        const newUsername = document.getElementById('inline-profile-username').value.trim();
        const newPassword = document.getElementById('inline-profile-password').value;
        const confirmPassword = document.getElementById('inline-profile-confirm-password').value;

        if (newPassword && newPassword.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (newUsername && newUsername !== currentUser.username) {
            if (users[newUsername]) {
                alert('Username already taken. Choose another.');
                return;
            }
            const oldUsername = currentUser.username;
            users[newUsername] = Object.assign({}, users[oldUsername]);
            users[newUsername].username = newUsername;
            delete users[oldUsername];
            currentUser = users[newUsername];
        }

        if (newPassword) currentUser.password = newPassword;

        const imgPreview = document.getElementById('inline-profile-image-preview');
        if (imgPreview && imgPreview.src && imgPreview.src.startsWith('data:image')) {
            currentUser.avatar = imgPreview.src;
        }

        users[currentUser.username] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthStatus();
        alert('Profile updated.');
        loadInlineProfileData();
    });
}

// Inline close handler
const inlineCloseBtn = document.getElementById('profile-inline-close');
if (inlineCloseBtn) inlineCloseBtn.addEventListener('click', () => toggleInlineProfile(false));

// Profile button: open inline panel when on category screen; otherwise open full profile
const profileBtn = document.getElementById('profile-button');
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        const catScreen = document.getElementById('category-screen');
        if (catScreen && !catScreen.classList.contains('hidden')) {
            e.preventDefault();
            toggleInlineProfile();
        } else {
            openProfileScreen();
        }
    });
}

function openProfileScreen() {
    if (!currentUser) {
        alert('You must be logged in to view your profile.');
        return;
    }
    loadProfileData();
    showScreen('profile-screen');
}

function saveProfileChanges() {
    if (!currentUser) return;
    const newUsername = document.getElementById('profile-username').value.trim();
    const newPassword = document.getElementById('profile-password').value;
    const confirmPassword = document.getElementById('profile-confirm-password').value;

    if (newPassword && newPassword.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }
    if (newPassword && newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Handle username change (ensure uniqueness)
    if (newUsername && newUsername !== currentUser.username) {
        if (users[newUsername]) {
            alert('Username already taken. Choose another.');
            return;
        }
        // Move user record to new username key
        const oldUsername = currentUser.username;
        users[newUsername] = Object.assign({}, users[oldUsername]);
        users[newUsername].username = newUsername;
        delete users[oldUsername];
        currentUser = users[newUsername];
    }

    // Update password if provided
    if (newPassword) {
        currentUser.password = newPassword;
    }

    // Update avatar if the preview has a data URL
    const imgPreview = document.getElementById('profile-image-preview');
    if (imgPreview.src && imgPreview.src.startsWith('data:image')) {
        currentUser.avatar = imgPreview.src;
    }

    users[currentUser.username] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthStatus();
    alert('Profile updated.');
    loadProfileData();
}

// Image upload handler: convert to base64 and preview
document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'profile-image-input') {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (evt) {
            document.getElementById('profile-image-preview').src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Wire profile buttons (legacy/full-profile actions). When on category screen we prefer the inline panel handler.
document.addEventListener('click', (e) => {
    if (!e.target) return;
    // If the category screen is visible, the dedicated profile-button handler will open the inline panel.
    const catScreen = document.getElementById('category-screen');
    const onCategoryScreen = catScreen && !catScreen.classList.contains('hidden');

    if (e.target.id === 'profile-button' || (e.target.closest && e.target.closest('#profile-button'))) {
        if (!onCategoryScreen) {
            openProfileScreen();
        }
    }
    if (e.target.id === 'profile-back-button') {
        showScreen('category-screen');
    }
    if (e.target.id === 'profile-save-button') {
        saveProfileChanges();
    }
});


// --- GEMINI API INTEGRATION (Question Generation) ---

/**
 * Utility to call the Gemini API to fetch questions with retries.
 * @param {string} promptText - The category prompt for the quiz.
 * @param {boolean} isNewUser - If true, requests tougher questions.
 */
async function callGeminiApi(promptText, isNewUser) {
    // Prefer local question bank when available (no external API calls required)
    if (LOCAL_QUESTIONS[promptText] && Array.isArray(LOCAL_QUESTIONS[promptText])) {
        // If the user is new, we may want to make the questions tougher by re-ordering or selecting the hardest ones.
        // For simplicity, return the local set (assumed to be tough). Mark as synchronous for compatibility.
        return LOCAL_QUESTIONS[promptText];
    }

    // If not found locally, attempt to call the external API (kept as fallback). If API_KEY is empty, skip.
    if (!API_KEY) {
        console.warn('No API_KEY set and no local questions available for:', promptText);
        return [];
    }

    // Existing API logic retained for fallback (omitted here to keep code concise). In this repo we rely on LOCAL_QUESTIONS.
    return [];
}


// --- QUIZ GAME FLOW MODULE ---

/**
 * Initializes and starts the quiz for the selected category.
 * @param {string} categoryName - The name of the selected category.
 */
async function startQuiz(categoryName) {
    showScreen('quiz-screen');
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-loading').classList.remove('hidden');

    // Reset state
    quizState = {
        questions: [],
        currentQIndex: 0,
        userAnswers: [],
        isCheating: false,
        currentCategory: categoryName
    };

    // Determine if the user is 'new' for potentially tougher questions
    const isNewUser = currentUser && currentUser.isNew === true;

    try {
        const questions = await callGeminiApi(categoryName, isNewUser);

        // Once quiz is started, mark user as not new for future quizzes
        if (isNewUser) {
            if (currentUser) {
                currentUser.isNew = false;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                if (users[currentUser.username]) {
                    users[currentUser.username].isNew = false;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        }

        if (questions && questions.length > 0) {
            quizState.questions = questions.slice(0, 20); // Ensure max 20 questions
            document.getElementById('quiz-loading').classList.add('hidden');
            document.getElementById('quiz-content').classList.remove('hidden');
            loadQuestion();
            // Add anti-cheating classes when quiz starts
            APP_CONTAINER.classList.add('quiz-active');
            setupSecurityChecks();
        } else {
            document.getElementById('quiz-loading').classList.add('hidden');
            alertMessage("Failed to load sufficient questions (Min 20 required). Please try a different category.", 'category-screen');
        }
    } catch (error) {
        console.error("Quiz startup error:", error);
        document.getElementById('quiz-loading').classList.add('hidden');
        alertMessage("An unexpected error occurred during question fetching.", 'category-screen');
    }
}

/**
 * Loads and renders the current question.
 */
function loadQuestion() {
    const q = quizState.questions[quizState.currentQIndex];
    if (!q) {
        return finishQuiz();
    }

    const currentQNumber = quizState.currentQIndex + 1;
    const totalQ = quizState.questions.length;

    // Update UI elements
    const qIndexEl = document.getElementById('q-index');
    if (qIndexEl) qIndexEl.textContent = `Question ${currentQNumber} of ${totalQ}`;
    document.getElementById('question-text').textContent = q.question;

    // Check if this is the last question
    const isLastQuestion = quizState.currentQIndex === totalQ - 1;
    const nextBtn = document.getElementById('next-button');
    const submitBtn = document.getElementById('submit-button');

    if (isLastQuestion) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    // Check for previous answer and disable/enable buttons accordingly
    const selectedAnswer = quizState.userAnswers[quizState.currentQIndex];

    // Update progress bar (reflects current question progress)
    updateProgress();

    // Render options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        // Support both prefixed options like "A: text" and plain option strings.
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const optionLetter = letters[index] || String.fromCharCode(65 + index);
        const optionText = (option.indexOf(':') !== -1) ? option.substring(option.indexOf(':') + 1).trim() : option;

        const isSelected = selectedAnswer === optionLetter;

        // Base class for options
        let buttonClass = 'w-full text-left p-3 rounded-md border border-primary/50 bg-card-bg hover:bg-gray-100 transition-colors duration-150 font-medium text-text-color';

        if (isSelected) {
            // Visually mark selected answer with a neutral (blue) color
            buttonClass = 'w-full text-left p-3 rounded-md border border-primary bg-blue-100 border-blue-600 ring-2 ring-blue-400 transition-colors duration-150 font-medium text-text-color';
        }

        const button = document.createElement('button');
        button.className = buttonClass;
        button.setAttribute('data-option', optionLetter);
        button.innerHTML = `<span class="font-bold text-primary mr-2">${optionLetter}.</span> ${optionText}`;
        button.onclick = () => selectOption(button, optionLetter);
        optionsContainer.appendChild(button);
    });

    // If an answer is selected, enable Next/Submit
    const isAnswered = selectedAnswer !== undefined;
    if (isAnswered) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

/**
 * Updates the progress bar and progress text based on answered questions.
 */
function updateProgress() {
    const totalQ = quizState.questions.length || 0;
    if (totalQ === 0) return;

    // Use current question number to show how far the user has progressed through the quiz.
    const currentQNumber = Math.min(quizState.currentQIndex + 1, totalQ);

    // Count answered questions for textual progress
    const answered = quizState.userAnswers.reduce((acc, a) => acc + (a ? 1 : 0), 0);

    // Progress percent based on position in quiz (so moving to next question advances the bar)
    let progressPercent = Math.round(((currentQNumber - 1) / totalQ) * 100);
    // If user has answered questions beyond index (e.g., answered ahead), factor that in
    const answeredPercent = Math.round((answered / totalQ) * 100);
    // Use the greater of position or answered percent so bar reflects both movement and answers
    progressPercent = Math.max(progressPercent, answeredPercent);

    // Clamp between 0 and 100
    progressPercent = Math.min(100, Math.max(0, progressPercent));

    const barEl = document.getElementById('progress-bar-fill');
    if (barEl) barEl.style.width = `${progressPercent}%`;

    const qIndexEl = document.getElementById('q-index');
    if (qIndexEl) qIndexEl.textContent = `Question ${currentQNumber} of ${totalQ}`;

    const qMarksEl = document.getElementById('q-marks');
    if (qMarksEl) qMarksEl.textContent = `Progress: ${answered} / ${totalQ}`;
}

/**
 * Handles the selection of an answer option (Recording only, no scoring).
 * @param {HTMLElement} button - The button element that was clicked.
 * @param {string} optionLetter - The letter of the selected option (A, B, C, D).
 */
function selectOption(button, optionLetter) {
    quizState.userAnswers[quizState.currentQIndex] = optionLetter;

    // Visual feedback: Un-highlight all and highlight the new selection with neutral color
    Array.from(document.getElementById('options-container').children).forEach(btn => {
        btn.className = 'w-full text-left p-3 rounded-md border border-primary/50 bg-card-bg hover:bg-gray-100 transition-colors duration-150 font-medium text-text-color';
    });

    // Highlight the selected button using a neutral blue color
    button.className = 'w-full text-left p-3 rounded-md border border-primary bg-blue-100 border-blue-600 ring-2 ring-blue-400 transition-colors duration-150 font-medium text-text-color';

    // Enable Next/Submit button immediately after selection
    document.getElementById('next-button').disabled = false;
    document.getElementById('next-button').classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('submit-button').disabled = false;
    document.getElementById('submit-button').classList.remove('opacity-50', 'cursor-not-allowed');

    // Update progress immediately when an answer is selected
    updateProgress();
}

/**
 * Advances to the next question.
 */
document.getElementById('next-button').addEventListener('click', () => {
    // Check if the current question has an answer recorded before advancing
    if (quizState.userAnswers[quizState.currentQIndex]) {
        quizState.currentQIndex++;
        loadQuestion();
        // Ensure progress updates for the newly loaded question
        updateProgress();
    }
});

/**
 * Submits the quiz and shows results.
 */
document.getElementById('submit-button').addEventListener('click', () => {
    // Ensure the last question has an answer recorded before finishing
    if (quizState.userAnswers[quizState.currentQIndex]) {
        // Final update before showing results
        updateProgress();
        finishQuiz();
    }
});

/**
 * Displays the final result screen (Score Calculation occurs here).
 */
function finishQuiz() {
    // 1. Calculate Score
    let correctCount = 0;
    const totalQuestions = quizState.questions.length;

    for (let i = 0; i < totalQuestions; i++) {
        const question = quizState.questions[i];
        const userAnswer = quizState.userAnswers[i];
        if (userAnswer && userAnswer === question.correct_answer) {
            correctCount++;
        }
    }

    const incorrectCount = totalQuestions - correctCount;

    // 2. Update UI
    document.getElementById('progress-bar-fill').style.width = '100%';
    document.getElementById('final-score').textContent = `${correctCount}/${totalQuestions}`;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;

    // 3. Clean up anti-cheating measures
    APP_CONTAINER.classList.remove('quiz-active');
    removeSecurityChecks();
    exitFullscreen();

    // 4. Display result screen
    // Save result to current user's profile (score history)
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const userRecord = users[currentUser.username] || currentUser;
        userRecord.scores = userRecord.scores || [];
        userRecord.scores.push({
            category: quizState.currentCategory || 'Unknown',
            score: `${correctCount}/${totalQuestions}`,
            correct: correctCount,
            total: totalQuestions,
            timestamp: Date.now()
        });
        users[userRecord.username] = userRecord;
        localStorage.setItem('users', JSON.stringify(users));
        // Update currentUser in localStorage as well
        currentUser = userRecord;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    setTimeout(() => {
        showScreen('result-screen');
    }, 500); // Give time for progress bar animation
}

// --- SECURITY / ANTI-CHEATING MODULE (Fullscreen Enforcement) ---

/**
 * Attempts to switch the browser to fullscreen mode.
 */
function requestFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log(`Fullscreen failed: ${err.message}`);
        });
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

/**
 * Attempts to exit fullscreen mode.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

/**
 * Check if user exits fullscreen.
 */
function handleFullscreenChange() {
    if (document.fullscreenElement === null && document.getElementById('quiz-screen').classList.contains('hidden') === false) {
        // User has exited fullscreen while quiz is active
        pauseQuiz("You must remain in fullscreen mode during the quiz. Re-entering fullscreen...");
    }
}

/**
 * Checks if user switches tabs (blur event).
 */
function handleWindowBlur() {
    if (document.getElementById('quiz-screen').classList.contains('hidden') === false && !quizState.isCheating) {
        // User switched tabs while quiz is active
        pauseQuiz("Do not switch tabs or windows during the quiz. Attempting to cheat may result in termination.");
    }
}

/**
 * Disables right-click and specific keyboard shortcuts.
 * @param {Event} e - Keyboard event.
 */
function handleKeyDown(e) {
    if (document.getElementById('quiz-screen').classList.contains('hidden')) return;

    // F12 (Dev Tools), Ctrl/Cmd+Shift+I, J, C (Dev Tools/Inspect), U (View Source)
    if (e.key === 'F12' || (e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'j' || e.key === 'c' || e.key === 'u' || e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'U')) {
        e.preventDefault();
        pauseQuiz("Accessing developer tools is not allowed during the exam.");
    }
    // Ctrl/Cmd + A (Select All), C (Copy), X (Cut), V (Paste)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'c' || e.key === 'x' || e.key === 'v')) {
        e.preventDefault();
        pauseQuiz("Copying content is disabled for security.");
    }
}

/**
 * Disables the context menu (right-click).
 * @param {Event} e - Mouse event.
 */
function handleContextMenu(e) {
    if (document.getElementById('quiz-screen').classList.contains('hidden') === false) {
        e.preventDefault();
    }
}

/**
 * Sets up all anti-cheating listeners.
 */
function setupSecurityChecks() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
}

/**
 * Removes all anti-cheating listeners.
 */
function removeSecurityChecks() {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
}

/**
 * Pauses the quiz and shows a warning message.
 * @param {string} message - The message to display.
 */
function pauseQuiz(message) {
    quizState.isCheating = true;
    // Prevent interaction with the quiz content while modal is open
    document.getElementById('quiz-content').style.pointerEvents = 'none';
    document.getElementById('quiz-message-text').textContent = message;
    document.getElementById('quiz-message-box').classList.remove('hidden');
}

/**
 * Resumes the quiz after a warning.
 */
function resumeQuiz() {
    document.getElementById('quiz-message-box').classList.add('hidden');
    document.getElementById('quiz-content').style.pointerEvents = 'auto';
    quizState.isCheating = false;
    requestFullscreen(); // Force fullscreen again
}

/**
 * Generic message box for non-security errors.
 * @param {string} msg
 * @param {string} returnScreenId
 */
function alertMessage(msg, returnScreenId) {
    // Using the security alert box as a generic modal for simplicity
    document.getElementById('quiz-message-text').textContent = msg;
    const messageBox = document.getElementById('quiz-message-box');
    messageBox.classList.remove('hidden');

    const resumeBtn = messageBox.querySelector('button');
    resumeBtn.textContent = "OK";
    resumeBtn.onclick = () => {
        messageBox.classList.add('hidden');
        showScreen(returnScreenId);
    };
}

// Initialize the application when the script loads
initApp();