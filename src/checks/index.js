module.exports = {
    L1: require('./l1_validate_target'),
    L2: require('./l2_dns_resolve'),
    L3: require('./l3_ping'),
    L4: require('./l4_tcp_443'),
    L5: require('./l5_tcp_80'),
    L6: require('./l6_traceroute'),
    L7: require('./l7_bgp_whois')
};
