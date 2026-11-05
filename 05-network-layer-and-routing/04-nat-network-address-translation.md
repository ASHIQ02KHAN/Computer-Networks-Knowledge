# 🔁 Chapter 04: Network Address Translation (NAT)

---

## 1. Overview (Topic Introduction)
With only $2^{32} \approx 4.29\text{ billion}$ possible IPv4 addresses, the Internet faced imminent address exhaustion by the late 1990s. The long-term solution is IPv6 (with 128-bit addresses), but the interim technology that saved the Internet and remains ubiquitous today is **Network Address Translation (NAT)** (RFC 3022). 

NAT allows an entire private local network (hundreds of laptops, phones, smart TVs) to share a **single public IP address** to access the global Internet. Understanding NAT requires tracing the 4-step transformation of packet headers and mastering the **Router's NAT Translation Table**.

---

## 2. Learning Objectives
After studying this chapter, you will be able to:
* Identify the **RFC 1918 Private IP Address Spaces** (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
* Explain the dual-interface role of a NAT router partitioning a private LAN from the public WAN.
* Master the 4-stage packet header rewrite lifecycle (Outbound: LAN $\to$ WAN; Inbound: WAN $\to$ LAN).
* Analyze which header fields change and which fields remain strictly constant in each direction.
* Construct and interpret the **Router's NAT Translation Table** mapping `(Private IP, Client Port)` to `(Public IP, NAT Port)`.
* Solve university final exam NAT problems with multiple internal hosts.

---

## 3. Core Concepts

### 3.1 Private vs. Public IP Addresses (RFC 1918)
Private IP addresses cannot be routed across the public Internet; intermediate ISP routers immediately discard packets destined for private IPs:
* `10.0.0.0` to `10.255.255.255` (`10.0.0.0/8`)
* `172.16.0.0` to `172.31.255.255` (`172.16.0.0/12`)
* `192.168.0.0` to `192.168.255.255` (`192.168.0.0/16`)

Any organization can reuse these private ranges internally without registering with ICANN!

---

### 3.2 The Dual Role of a NAT-Enabled Router
A NAT router sits directly between a private LAN and the public Internet:
* **LAN Side (Internal):** The router possesses a private IP address (e.g., `192.168.1.1`), acting as the default gateway for local hosts.
* **WAN Side (External):** The router possesses a single globally unique, routable public IP address provided by the ISP (e.g., `103.4.5.6`).

---

### 3.3 The 4-Step Header Transformation (Private Source vs. Public Translation)

```
  Private LAN (192.168.1.0/24)            NAT Router (103.4.5.6)               Public Internet
┌──────────────────────────────┐          ┌────────────────────┐          ┌──────────────────────┐
│ Host 1: 192.168.1.10:5001    │          │ LAN IP: 192.168.1.1│          │ Public Web Server    │
│                              │          │ WAN IP: 103.4.5.6  │          │ IP: 201.1.2.3        │
│ Host 2: 192.168.1.11:5001    │          │                    │          │ Port: 80             │
└──────────────┬───────────────┘          └─────────┬──────────┘          └──────────┬───────────┘
               │                                    │                                │
               │ (1) Outbound LAN Packet            │                                │
               ├───────────────────────────────────▶│                                │
               │     Src: 192.168.1.10 : 5001       │                                │
               │     Dst: 201.1.2.3    : 80         │                                │
               │                                    │ (2) Outbound WAN Packet        │
               │                                    ├───────────────────────────────▶│
               │                                    │     Src: 103.4.5.6 : 1001      │
               │                                    │     Dst: 201.1.2.3 : 80        │
               │                                    │                                │
               │                                    │ (3) Inbound Reply from Server  │
               │                                    │◀───────────────────────────────┤
               │                                    │     Src: 201.1.2.3 : 80        │
               │                                    │     Dst: 103.4.5.6 : 1001      │
               │ (4) Inbound Delivery to LAN Host   │                                │
               │◀───────────────────────────────────┤                                │
               │     Src: 201.1.2.3    : 80         │                                │
               │     Dst: 192.168.1.10 : 5001       │                                │
```

---

### 3.4 Summary Table of Header Changes (From CN Class Note 2, Page 22)

| Direction | Source Changed? | Destination Changed? | Explanation |
|---|---|---|---|
| **Client $\to$ Server** (Outbound) | ✅ **YES** (`192.168.1.10:5001` $\to$ `103.4.5.6:1001`) | ❌ **NO** (`201.1.2.3:80` remains constant) | Router replaces private source with its own public IP and generates a unique NAT port. |
| **Server $\to$ Client** (Inbound) | ❌ **NO** (`201.1.2.3:80` remains constant) | ✅ **YES** (`103.4.5.6:1001` $\to$ `192.168.1.10:5001`) | Router looks up NAT port 1001 in its table and rewrites the destination to the internal host! |

---

## 4. Visual Explanation (Diagrams)

### 4.1 The Router NAT Table Layout
```
┌────────────────────────────────────────┬────────────────────────────────────────┐
│      Inside Local (Private LAN)        │      Outside Global (Public WAN)       │
├────────────────────────────────────────┼────────────────────────────────────────┤
│           192.168.1.10 : 5001          │            103.4.5.6 : 1001            │
│           192.168.1.11 : 5001          │            103.4.5.6 : 1002            │
│           192.168.1.10 : 6000          │            103.4.5.6 : 1003            │
└────────────────────────────────────────┴────────────────────────────────────────┘
```
* Even if both Host 1 and Host 2 coincidentally use the identical client source port `5001`, the NAT router assigns them distinct external NAT ports (`1001` and `1002`), ensuring perfect collision-free demultiplexing!


### 4.2 NAT Full Packet Flow — Sequence Diagram

`mermaid
sequenceDiagram
    participant C as 🖥️ LAN Client<br/>(192.168.1.10:5001)
    participant NAT as 🔀 NAT Router<br/>(Public: 103.4.5.6)
    participant S as 🌐 Web Server<br/>(201.1.2.3:80)

    Note over C,S: OUTBOUND FLOW (Steps 1-2)
    C->>NAT: Src: 192.168.1.10:5001<br/>Dst: 201.1.2.3:80
    Note over NAT: Creates NAT Entry:<br/>192.168.1.10:5001 ↔ 103.4.5.6:1001<br/>Rewrites Source address
    NAT->>S: Src: 103.4.5.6:1001<br/>Dst: 201.1.2.3:80

    Note over C,S: INBOUND FLOW (Steps 3-4)
    S->>NAT: Src: 201.1.2.3:80<br/>Dst: 103.4.5.6:1001
    Note over NAT: Looks up NAT table:<br/>Port 1001 → 192.168.1.10:5001<br/>Rewrites Destination address
    NAT->>C: Src: 201.1.2.3:80<br/>Dst: 192.168.1.10:5001
`

---

## 5. Step-by-Step 4-Stage Lifecycle
1. **Step 1 (Client $\to$ Router):** Client creates packet with `Src: 192.168.1.10:5001` and `Dst: 201.1.2.3:80`. Sends it to default gateway.
2. **Step 2 (Router $\to$ Server):** Router receives packet, generates a new NAT port `1001`, records the mapping in its NAT table, rewrites `Src` to `103.4.5.6:1001`, recalculates IP and TCP checksums, and forwards to WAN.
3. **Step 3 (Server $\to$ Router):** Server replies to the only sender it knows: `Src: 201.1.2.3:80`, `Dst: 103.4.5.6:1001`.
4. **Step 4 (Router $\to$ Client):** Router inspects arrival port `1001`, finds entry `192.168.1.10:5001` in its table, rewrites `Dst` to `192.168.1.10:5001`, and delivers packet across the LAN!

---

## 6. Real-Life Example
* **Corporate Office Telephone Extension Analogy:**
  - A company with 500 employees has only **one public telephone number**: `(02) 988-1234`.
  - Employee Ashik sits at extension `#101`.
  - When Ashik calls an external client (**Step 1 & 2**), the client's caller ID displays the main office number `(02) 988-1234` plus an extension routing tag.
  - When the client calls back (**Step 3**), they dial `(02) 988-1234` and enter extension `#101`.
  - The office receptionist (**NAT Router**) connects the call directly to Ashik’s desk phone (**Step 4**).

---

## 7. Practical Implementation (Python NAT Simulator)

```python
class NATRouter:
    def __init__(self, public_ip="103.4.5.6", starting_nat_port=1001):
        self.public_ip = public_ip
        self.next_port = starting_nat_port
        self.table_outbound = {} # (private_ip, private_port) -> nat_port
        self.table_inbound = {}  # nat_port -> (private_ip, private_port)

    def translate_outbound(self, src_ip, src_port, dst_ip, dst_port):
        key = (src_ip, src_port)
        if key not in self.table_outbound:
            nat_port = self.next_port
            self.next_port += 1
            self.table_outbound[key] = nat_port
            self.table_inbound[nat_port] = key
        else:
            nat_port = self.table_outbound[key]

        # Rewritten packet
        return {
            'src_ip': self.public_ip,
            'src_port': nat_port,
            'dst_ip': dst_ip,
            'dst_port': dst_port
        }

    def translate_inbound(self, src_ip, src_port, dst_ip, dst_port):
        # dst_port on WAN is the nat_port
        nat_port = dst_port
        if nat_port in self.table_inbound:
            priv_ip, priv_port = self.table_inbound[nat_port]
            return {
                'src_ip': src_ip,
                'src_port': src_port,
                'dst_ip': priv_ip,
                'dst_port': priv_port
            }
        return None # Dropped

# Test Case from CN Class Note 2, Page 22:
nat = NATRouter("103.4.5.6")
# Host 1 sends web request:
p1_out = nat.translate_outbound("192.168.1.10", 5001, "201.1.2.3", 80)
print("Step 2 Outbound WAN Packet:", p1_out)

# Server replies:
p1_in = nat.translate_inbound("201.1.2.3", 80, "103.4.5.6", p1_out['src_port'])
print("Step 4 Inbound LAN Packet :", p1_in)
```

---

## 8. Common Mistakes & Pitfalls
> [!WARNING]
> * **Assuming the Destination changes on Outbound Packets:** When an internal host sends a packet to Google (`142.251.211.78`), the destination IP remains `142.251.211.78`! Only the **Source IP and Source Port** are translated on the way out!
> * **Believing Inbound Connections can be Initiated from the Outside:** By default, external hosts CANNOT initiate a connection to an internal host behind NAT because the NAT table has no mapping until an internal host speaks first! (Requires Port Forwarding).

---

## 9. Practice Problems & Exam Walkthroughs

### 📝 Problem 1 (From Fall 2025 Final 251 Q3(a) & Class Note 2, Page 16)
**Question:** Ahmad has private IP `192.168.70.9` and connects from client port `8005` to a web server at `172.217.19.164:80`. The local NAT router R2 has public IP `211.99.88.101` and allocates NAT ports starting from `8001`.
1. Specify the Source and Destination IP and Port for the packet on the internal LAN.
2. Specify the Source and Destination IP and Port for the packet on the external WAN.
3. Show the entry created in the router’s NAT table.
4. When the server replies, what are the Source and Destination IP and Port received at Ahmad's computer?

**Step-by-Step Solution:**
1. **On Internal LAN (Client $\to$ Router):**
   - Source IP: `192.168.70.9` | Source Port: `8005`
   - Destination IP: `172.217.19.164` | Destination Port: `80`
2. **On External WAN (Router $\to$ Server):**
   - Source IP: `211.99.88.101` (Public IP) | Source Port: `8001` (Allocated NAT Port)
   - Destination IP: `172.217.19.164` | Destination Port: `80`
3. **Router's NAT Table Entry:**
   | Inside (LAN) | Outside (WAN) |
   |---|---|
   | `192.168.70.9 : 8005` | `211.99.88.101 : 8001` |
4. **Delivered to Ahmad's Computer (Step 4):**
   - Source IP: `172.217.19.164` | Source Port: `80`
   - Destination IP: `192.168.70.9` | Destination Port: `8005`

---

## 10. Knowledge Check (MCQ & Quizzes)

#### Q1. Which of the following IP addresses is defined as a non-routable private IP under RFC 1918?
- [ ] A) `128.119.245.12`
- [ ] B) `203.0.113.1`
- [x] C) `192.168.1.1`
- [ ] D) `211.99.88.101`
*Explanation:* `192.168.0.0/16` is designated specifically for private local area networks.

#### Q2. During outbound NAT translation from a private host to an Internet server, which header field remains unchanged?
- [ ] A) Source IP
- [ ] B) Source Port
- [ ] C) IP Checksum
- [x] D) Destination IP
*Explanation:* The packet must still reach the server at its original destination IP; only the source address and port are rewritten.

---

## 11. Summary & Revision Sheet
* **Purpose:** Allows multiple private hosts (`192.168.x.x`, `10.x.x.x`) to share one public IP.
* **Outbound Rewrite:** Source IP $\to$ Router Public IP; Source Port $\to$ NAT Port. Destination unchanged.
* **Inbound Rewrite:** Destination IP $\to$ Private IP; Destination Port $\to$ Client Port. Source unchanged.
* **Table:** Maps `(Private IP, Client Port) <-> (Public IP, NAT Port)`.

---

---

## 🔗 Related Topics

> Connect your understanding — explore these closely related chapters:

- 📖 [IPv4](02-ipv4-and-fragmentation.md) — RFC 1918 private address space that NAT is built for
- 📖 [DHCP](03-dhcp-dynamic-addressing.md) — Private IP assignment that NAT then translates
- 📖 [Network Attacks](../02-network-security-fundamentals/02-network-attacks-and-defense.md) — NAT as a natural security barrier against unsolicited inbound connections

## 12. References & Further Reading
* RFC 3022: *Traditional IP Network Address Translator (Traditional NAT)*.
* Kurose & Ross, Chapter 4.3.4: *Network Address Translation (NAT)*.



---

<div align="center">

| [⬅️ Previous](03-dhcp-dynamic-addressing.md) | [🏠 Module Index](README.md) | [Next ➡️](05-routing-algorithms-dijkstra.md) |
|:---:|:---:|:---:|

</div>
