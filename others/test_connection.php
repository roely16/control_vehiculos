<?php 

	include '../db/oracle.php';

	$dbc = new Oracle();
	
	$conn = $dbc->connect();

	$stid = oci_parse($conn, 'SELECT * FROM ADM_STATUS');
	oci_execute($stid);
	

	echo "<table border='1'>\n";
	while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
	    echo "<tr>\n";
	    foreach ($row as $item) {
	        echo "    <td>" . ($item !== null ? htmlentities($item, ENT_QUOTES) : "") . "</td>\n";
	    }
	    echo "</tr>\n";
	}
	echo "</table>\n";	

	$dbc->disconnect($conn);


?>