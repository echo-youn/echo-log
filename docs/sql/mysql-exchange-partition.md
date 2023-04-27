# Exchange Partition

Need create, drop grant!!
In addition to the ALTER, INSERT, and CREATE privileges usually required for ALTER TABLE statements, you must have the DROP privilege to perform ALTER TABLE ... EXCHANGE PARTITION.

You should also be aware of the following effects of ALTER TABLE ... EXCHANGE PARTITION:

Executing ALTER TABLE ... EXCHANGE PARTITION does not invoke any triggers on either the partitioned table or the table to be exchanged.

Any AUTO_INCREMENT columns in the exchanged table are reset.

The IGNORE keyword has no effect when used with ALTER TABLE ... EXCHANGE PARTITION.

