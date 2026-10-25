export interface Question {
  id: string
  order: number
  text: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

export const QUESTIONS: Question[] = [
  {
    id: 'q01', order: 1,
    text: 'How many layers does the OSI model have?',
    options: { A: '5', B: '6', C: '7', D: '4' },
    correct: 'C',
    explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
    difficulty: 'easy', timeLimit: 20,
  },
  {
    id: 'q02', order: 2,
    text: 'Which protocol provides reliable, connection-oriented data transmission?',
    options: { A: 'UDP', B: 'TCP', C: 'ICMP', D: 'ARP' },
    correct: 'B',
    explanation: 'TCP guarantees delivery through acknowledgments, sequencing, and retransmission.',
    difficulty: 'easy', timeLimit: 20,
  },
  {
    id: 'q03', order: 3,
    text: 'What is the purpose of ARP in a network?',
    options: {
      A: 'Translate domain names to IP addresses',
      B: 'Assign IP addresses to hosts dynamically',
      C: 'Map an IP address to a MAC address',
      D: 'Route packets between different networks',
    },
    correct: 'C',
    explanation: 'ARP resolves IPv4 addresses to MAC addresses on a local network segment.',
    difficulty: 'easy', timeLimit: 20,
  },
  {
    id: 'q04', order: 4,
    text: 'Which OSI layer is responsible for end-to-end error recovery and flow control?',
    options: { A: 'Network', B: 'Session', C: 'Data Link', D: 'Transport' },
    correct: 'D',
    explanation: 'The Transport layer (Layer 4) handles end-to-end communication, error recovery, and flow control.',
    difficulty: 'easy', timeLimit: 20,
  },
  {
    id: 'q05', order: 5,
    text: 'How many usable host addresses does a /24 subnet provide?',
    options: { A: '256', B: '254', C: '255', D: '253' },
    correct: 'B',
    explanation: '256 total − 1 network address − 1 broadcast = 254 usable host addresses.',
    difficulty: 'medium', timeLimit: 25,
  },
  {
    id: 'q06', order: 6,
    text: 'Which protocol automatically assigns IP addresses, subnet masks, and default gateways?',
    options: { A: 'DNS', B: 'ICMP', C: 'DHCP', D: 'SNMP' },
    correct: 'C',
    explanation: 'DHCP dynamically assigns IP configuration to hosts, eliminating manual setup.',
    difficulty: 'easy', timeLimit: 20,
  },
  {
    id: 'q07', order: 7,
    text: "What is the correct sequence in TCP's three-way handshake?",
    options: {
      A: 'SYN → SYN-ACK → ACK',
      B: 'ACK → SYN → SYN-ACK',
      C: 'SYN → ACK → SYN-ACK',
      D: 'SYN-ACK → SYN → ACK',
    },
    correct: 'A',
    explanation: 'Client sends SYN, server responds SYN-ACK, client completes with ACK.',
    difficulty: 'medium', timeLimit: 25,
  },
  {
    id: 'q08', order: 8,
    text: "Which routing protocol uses Dijkstra's algorithm to compute shortest paths?",
    options: { A: 'RIP', B: 'BGP', C: 'OSPF', D: 'EIGRP' },
    correct: 'C',
    explanation: "OSPF is a link-state protocol that uses Dijkstra's algorithm to build the shortest-path tree.",
    difficulty: 'medium', timeLimit: 25,
  },
  {
    id: 'q09', order: 9,
    text: 'What does the sliding window protocol primarily control?',
    options: {
      A: 'IP address assignment',
      B: 'Flow control and error control in data transmission',
      C: 'MAC address resolution',
      D: 'DNS query resolution',
    },
    correct: 'B',
    explanation: 'The sliding window protocol enables flow control by allowing multiple frames before requiring acknowledgment.',
    difficulty: 'medium', timeLimit: 25,
  },
  {
    id: 'q10', order: 10,
    text: 'Which topology offers the highest fault tolerance by connecting every node to every other node?',
    options: { A: 'Star', B: 'Ring', C: 'Bus', D: 'Mesh' },
    correct: 'D',
    explanation: 'A full mesh topology connects every node to every other, providing maximum redundancy.',
    difficulty: 'medium', timeLimit: 20,
  },
  {
    id: 'q11', order: 11,
    text: 'What is the primary difference between HTTP and HTTPS?',
    options: {
      A: 'HTTPS uses UDP; HTTP uses TCP',
      B: 'HTTPS encrypts data using TLS; HTTP transmits in plaintext',
      C: 'HTTPS operates on port 80; HTTP on port 443',
      D: 'HTTPS is faster because it compresses headers',
    },
    correct: 'B',
    explanation: 'HTTPS adds TLS encryption to HTTP, securing data in transit. HTTP uses port 80; HTTPS port 443.',
    difficulty: 'medium', timeLimit: 25,
  },
  {
    id: 'q12', order: 12,
    text: 'A host pings 127.0.0.1. What does this test?',
    options: {
      A: 'Connectivity to the default gateway',
      B: 'Connectivity to a remote DNS server',
      C: "The host's own TCP/IP stack (loopback)",
      D: 'The physical network cable',
    },
    correct: 'C',
    explanation: "127.0.0.1 is the loopback address. Pinging it verifies the host's own TCP/IP software stack.",
    difficulty: 'hard', timeLimit: 20,
  },
  {
    id: 'q13', order: 13,
    text: 'Which IPv6 address is equivalent to IPv4 broadcasting to all local nodes?',
    options: { A: '::1', B: 'FF02::1', C: 'FE80::1', D: '2001:DB8::1' },
    correct: 'B',
    explanation: 'FF02::1 is the all-nodes multicast address, functionally equivalent to local broadcast on the link.',
    difficulty: 'hard', timeLimit: 25,
  },
  {
    id: 'q14', order: 14,
    text: 'When TCP detects packet loss via triple duplicate ACKs, what does it do?',
    options: {
      A: 'Resets the connection entirely',
      B: 'Halves the congestion window (Fast Retransmit / Fast Recovery)',
      C: 'Sets the congestion window to 1 MSS',
      D: 'Switches from TCP to UDP',
    },
    correct: 'B',
    explanation: 'Triple duplicate ACKs trigger Fast Retransmit: TCP retransmits and halves the congestion window.',
    difficulty: 'hard', timeLimit: 30,
  },
  {
    id: 'q15', order: 15,
    text: 'FINAL CHALLENGE: Routing table has 10.0.0.0/8→eth0, 10.4.0.0/16→eth1, 0.0.0.0/0→eth2. Destination: 10.4.0.1. Which interface?',
    options: {
      A: 'eth0 — longest prefix is /8',
      B: 'eth2 — default route always wins',
      C: 'eth1 — longest prefix match is /16',
      D: 'Packet is dropped — ambiguous',
    },
    correct: 'C',
    explanation: 'Longest prefix match: /16 is more specific than /8 or /0, so eth1 is chosen.',
    difficulty: 'hard', timeLimit: 35,
  },
]

export function toPublicQuestion(q: Question) {
  const { correct, explanation, ...pub } = q
  return pub
}
