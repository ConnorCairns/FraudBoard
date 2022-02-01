# Fraud Dashboard
The core of this project would involve putting together a framework that 
can take in a (fraud-related) domain and make use of a number of automated
queries to various online services to figure out how much money a scammer has
invested in this site in terms of hosting, domains, advertisement spend, etc.
The goal more generally is that we would deploy this framework against a large
list (possibly a feed) of currently-operating fraud domains, classify those
domains according to the type of scam they are running, and then use this
information to arrive at a better understanding of which scams should be
targeted by researchers and law enforcement -- the general principle being that
if scammers are investing money, they're making it back somehow.