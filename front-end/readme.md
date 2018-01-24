To use this project

Download MAMP - https://www.mamp.info/en/
(or use Apache)

Open MAMP’s httpd.conf (located at /Applications/MAMP/conf/apache/httpd.conf) in a plain text editor.
Uncomment these 2 lines

AddType text/html .shtml
AddOutputFilter INCLUDES .shtml

Start MAMP
In preferences set apache to use the directory you downloaded the src to
Check the Apache port is :8888 

Save

Start Servers from MAMP homescreen

From the directory run grunt

Open localhost:8888 (or wherever the port is)

You should be up and running