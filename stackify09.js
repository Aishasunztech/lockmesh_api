/**
 * Stackify Node APM Configuration
 */

if(process.env.HOST_NAME) const serverEnv = process.env.HOST_NAME;
else const serverEnv = 'localhost';

exports.config = {
	/**
	 * Your application name. 
	 */
	application_name: "LockMesh",
	/**
	 * Your environment name.
	 */
	environment_name: serverEnv
};
