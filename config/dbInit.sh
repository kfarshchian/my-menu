#!/bin/bash
echo 'logging into db root as techblog'
mysql -u root --password="Buckingham1429"  << EOF
SOURCE db/schema.sql;
quit
EOF
echo 'Seeding Database'
node seeds/seed.js