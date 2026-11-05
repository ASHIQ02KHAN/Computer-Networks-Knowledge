# 🚀 Master Concepts, Formulas, and Exam Solution Cheat Sheet

> **The Ultimate All-in-One Computer Networks Quick-Revision Guide**  
> Covers every equation, conversion rule, decision table, and solved exam pattern across all six layers.

---

## 🧮 1. Essential Unit Conversions & Multipliers

> [!CAUTION]
> **Always Convert Before Calculating!**  
> Transmission speeds use **bits**, file sizes use **Bytes**. Always multiply Bytes by 8!

* **Data Unit Conversion:**
  - $1\text{ Byte (B)} = 8\text{ bits (b)}$
  - $1\text{ Word} = 2\text{ Bytes} = 16\text{ bits}$
* **Networking Metric Multipliers (Bandwidth / Link Rate):**
  - $1\text{ kbps} = 10^3\text{ bps} = 1,000\text{ bps}$
  - $1\text{ Mbps} = 10^6\text{ bps} = 1,000,000\text{ bps}$
  - $1\text{ Gbps} = 10^9\text{ bps} = 1,000,000,000\text{ bps}$
* **Time Multipliers (Delay / RTT):**
  - $1\text{ second (s)} = 1,000\text{ milliseconds (ms)} = 10^3\text{ ms}$
  - $1\text{ millisecond (ms)} = 1,000\text{ microseconds (\mu s)} = 10^3\text{ }\mu\text{s}$
  - $1\text{ microsecond (\mu s)} = 1,000\text{ nanoseconds (ns)} = 10^3\text{ ns}$
* **Speed of Light in Transmission Medium:**
  - $s \approx 2 \times 10^8\text{ m/s}$ (fiber/copper) to $3 \times 10^8\text{ m/s}$ (air/vacuum).

---

## 📊 2. Master Formula Table by Chapter

### Topic 1: Circuit Switching & TDM Math
* **Maximum Users in Circuit Switching:**
  $$N_{\text{circuit}} = \left\lfloor \frac{\text{Total Link Bandwidth}}{\text{Per-User Required Bandwidth}} \right\rfloor$$
* **Bandwidth per TDM Slot:**
  $$\text{Slot Bandwidth} = \frac{\text{Total Link Bandwidth}}{\text{Total Slots per Second}}$$
* **File Transmission Time over Circuit:**
  $$\text{Total Time} = \text{Circuit Setup Time} + \frac{\text{File Size (bits)}}{\text{Slot Bandwidth}}$$

---

### Topic 2: Packet Switching & Binomial Probability
* **Binomial Probability of $k$ active users among $N$ total users (each active with probability $p$):**
  $$P(X = k) = \binom{N}{k} p^k (1 - p)^{N - k} = \frac{N!}{k!(N - k)!} p^k (1 - p)^{N - k}$$
* **Probability of Congestion (more than $M$ users transmitting simultaneously):**
  $$P(X > M) = \sum_{i = M + 1}^{N} \binom{N}{i} p^i (1 - p)^{N - i}$$

---

### Topic 3: The 4 Nodal Delays & Throughput
* **Total Nodal Delay:**
  $$d_{\text{nodal}} = d_{\text{proc}} + d_{\text{que}} + d_{\text{trans}} + d_{\text{prop}}$$
* **Transmission Delay (Hardware/Link dependent):**
  $$d_{\text{trans}} = \frac{L}{R} = \frac{\text{Packet Size in bits}}{\text{Link Bandwidth in bps}}$$
* **Propagation Delay (Physical medium/Distance dependent):**
  $$d_{\text{prop}} = \frac{d}{s} = \frac{\text{Distance in meters}}{\text{Propagation Speed in m/s}}$$
* **Queuing Delay with $n$ packets in buffer:**
  $$d_{\text{que}} = n \times \frac{L}{R}$$
* **End-to-End Multi-Hop Delay ($N$ links, $N-1$ routers):**
  $$d_{\text{end-to-end}} = \sum_{i=1}^{N} \left( \frac{L}{R_i} + \frac{d_i}{s_i} \right) + \sum_{j=1}^{N-1} (d_{\text{proc}, j} + d_{\text{que}, j})$$
* **Bottleneck Throughput:**
  $$\text{Throughput} = \min(R_1, R_2, \dots, R_N)$$

---

### Topic 4: MTU Segmentation & Header Overhead
* **Total Header Overhead per Segment:**
  $$\text{Overhead} = H_{\text{DataLink}} + H_{\text{Network}} + H_{\text{Transport}} + T_{\text{DataLink}} = 14 + 20 + 20 + 4 = 58\text{ Bytes}$$
* **Maximum Application Payload per Segment:**
  $$\text{Payload}_{\max} = \text{MTU} - \text{Total Overhead}$$
* **Number of Segments Required:**
  $$\text{Segments} = \left\lceil \frac{\text{Total Application Data}}{\text{Payload}_{\max}} \right\rceil$$

---

### Topic 5: HTTP Web Retrieval Time
* **File Transmission Time (FTT):**
  $$\text{FTT} = \frac{\text{Object Size (Bytes)} \times 8}{\text{Bandwidth (bps)}}$$
* **Non-Persistent HTTP (Sequential):**
  $$\text{Total Time} = \sum_{i=1}^{N} (2\text{RTT}_i + \text{FTT}_i)$$
* **Persistent HTTP (Without Pipelining):**
  $$\text{Total Time} = 1\text{RTT}_{\text{connection}} + \sum_{i=1}^{N} (1\text{RTT}_i + \text{FTT}_i)$$

---

### Topic 6: 16-Bit Internet Checksum (RFC 1071)
1. Convert bytes into 16-bit binary or 4-digit hexadecimal words.
2. Sum all words.
3. If sum exceeds 16 bits (carry overflow $> 0$): Add carry bits back to LSB (**Wrap-Around**).
4. Take 1's complement: $\text{Checksum} = \text{0xFFFF} - \text{Wrapped Sum}$.
5. **Receiver Verification:** $\text{Sum(Data + Checksum)} + \text{Wrap} == \text{0xFFFF} \implies \text{Valid!}$

---

### Topic 7: TCP Sequence and Acknowledgement Numbers
* **Sequence Number:** Starting byte index of the transmitted segment:
  $$\text{Seq}_{\text{next}} = \text{Seq}_{\text{curr}} + \text{Payload Bytes}$$
* **Acknowledgement Number:** Next byte the receiver expects to receive:
  $$\text{ACK Number} = \text{Received Seq} + \text{Received Payload Bytes}$$
* **Control Flag Sequence Consumption:**
  - `SYN` packet consumes **1 Byte** of sequence space!
  - `FIN` packet consumes **1 Byte** of sequence space!

---

### Topic 8: TCP Congestion Control State Transitions

| State / Event | Condition | Action on $cwnd$ | Action on $ssthresh$ | Next Phase |
|---|---|---|---|---|
| **Slow Start** | $cwnd < ssthresh$ | $cwnd = cwnd \times 2$ (doubles every RTT) | Unchanged | Continues Slow Start |
| **Congestion Avoidance** | $cwnd \ge ssthresh$ | $cwnd = cwnd + 1\text{ MSS}$ (per RTT) | Unchanged | Continues Congestion Avoidance |
| **3 Duplicate ACKs** | Mild packet loss | $cwnd = \lfloor cwnd / 2 \rfloor$ | $ssthresh = \lfloor cwnd / 2 \rfloor$ | **Congestion Avoidance** (Fast Recovery) |
| **Timeout** | Severe packet loss | **$cwnd = 1\text{ MSS}$** | $ssthresh = \lfloor cwnd / 2 \rfloor$ | **Slow Start** |

---

### Topic 9: IPv4 Fragmentation 8-Byte Boundary Rule
1. **Candidate Payload:** $\text{Candidate} = \text{MTU} - \text{Header Size}$
2. **Enforce 8-Byte Multiple:**
   $$\text{Max Payload} = \left\lfloor \frac{\text{Candidate}}{8} \right\rfloor \times 8$$
3. **Number of Fragments:**
   $$K = \left\lceil \frac{\text{Total Original Payload}}{\text{Max Payload}} \right\rceil$$
4. **Fragment Offset:**
   $$\text{Offset Field} = \frac{\text{Cumulative Preceding Payload Bytes}}{8}$$
5. **More Fragments (MF) Flag:**
   - $MF = 1$ for fragments $1$ through $K-1$.
   - $MF = 0$ for final fragment $K$.

---

### Topic 10: NAT Header Rewrite Rules

| Packet Direction | Source IP & Port | Destination IP & Port |
|---|---|---|
| **LAN Client $\to$ Router** | `Private IP : Client Port` | `Server IP : Server Port` |
| **Router $\to$ WAN Server** | **`Router Public IP : NAT Port`** (Rewritten!) | `Server IP : Server Port` (Unchanged) |
| **WAN Server $\to$ Router** | `Server IP : Server Port` (Unchanged) | `Router Public IP : NAT Port` (Targeted) |
| **Router $\to$ LAN Client** | `Server IP : Server Port` | **`Private IP : Client Port`** (Rewritten!) |

---

### Topic 11: Link-State Routing & Dijkstra
* **Relaxation Step:**
  $$D(v) = \min(D(v), \ D(w) + c(w, v))$$
* **Forwarding Table Entry:**
  $$\text{Forwarding Table Entry for Destination } v = \mathbf{\text{Immediate First-Hop Link Interface from Source}}$$

---

### Topic 12: Cyclic Redundancy Check (CRC)
* Generator polynomial $G$ has length $r + 1 \implies$ append $r$ zeros to data $D$.
* Perform Modulo-2 binary division ($D \cdot 2^r \div G$) using bitwise **XOR** (no borrows).
* Remainder $R$ ($r$ bits) is appended to $D$ to form transmitted codeword.

---

## 🎯 3. Master Protocols & Well-Known Ports

| Protocol | Full Name | Layer | Transport Protocol | Default Port | Purpose |
|---|---|:---:|:---:|:---:|---|
| **DNS** | Domain Name System | 7 | **UDP** (primarily) / TCP | **53** | Hostname to IP translation |
| **HTTP** | HyperText Transfer Protocol | 7 | **TCP** | **80** | Unencrypted Web traffic |
| **HTTPS** | HTTP Secure (over TLS) | 7 | **TCP** | **443** | Encrypted Web traffic |
| **SMTP** | Simple Mail Transfer Protocol | 7 | **TCP** | **25** (or 587) | Mail server-to-server push relay |
| **POP3** | Post Office Protocol v3 | 7 | **TCP** | **110** | Download-and-delete mail access |
| **IMAP** | Internet Message Access Protocol | 7 | **TCP** | **143** | Synchronized mail access |
| **DHCP** | Dynamic Host Configuration Protocol | 7 | **UDP** | **67** (Server), **68** (Client) | Plug-and-play IP leasing (DORA) |
| **ARP** | Address Resolution Protocol | 2 / 3 | N/A (Directly in Frame) | N/A | Maps IP $\to$ MAC (`FF:FF:FF:FF:FF:FF`) |
| **OSPF** | Open Shortest Path First | 3 | Directly over IP (Proto 89) | N/A | Link-state intra-AS routing |
| **BGP** | Border Gateway Protocol | 3 / 7 | **TCP** | **179** | Inter-AS path vector routing |

---

## 🏆 4. The "5 Things to Remember for 100/100" (Class Note 2, Page 28)

1. **Routing Information Sharing (Most Common Exam Mistake!):**
   - **Link-State (OSPF):** Sends to **ALL nodes**, but shares info about **ONLY neighbors**!
   - **Distance-Vector (RIP):** Sends to **ONLY neighbors**, but shares info about **ALL nodes**!
2. **Forwarding Table Entries:**
   - In a router forwarding table, write **ONLY the immediate first-hop interface link** `(Source, NextHop)`, NEVER write the entire multi-hop path!
3. **TCP Acknowledgement Number Definition:**
   - ACK is **NEVER** the sequence number just received; it is the **NEXT byte expected** ($\text{Received Seq} + \text{Received Payload Bytes}$)!
4. **IP Fragmentation 8-Byte Divisibility:**
   - The payload of all fragments (except the last) **must be divisible by 8**. If $(\text{MTU} - \text{Header}) / 8$ has a remainder, you **must floor round down** ($\lfloor \text{Payload}/8 \rfloor \times 8$)!
5. **Cross-Subnet Destination MAC Address:**
   - When sending a packet to an IP outside your local subnet, the destination MAC address is **ALWAYS your Default Gateway Router's interface MAC**, NEVER the remote host's MAC!

