/**
 * @author mrdoob / http://mrdoob.com/
 */
/*
///MeshFaceMaterial方法根据参数materials创建mesh(网格)的复合材质类型,参数material是一个Material类型的数组对象,网格中的三角面属性materialindex定义了该三角面使用的参数material中材质对象的索引号.
*/
///<summary>MeshFaceMaterial</summary>
///<param name ="materials" type="Array">Material类型的数组</param>
///<returns type="MeshFaceMaterial">返回MeshFaceMaterial,复合材质.</returns>
THREE.MeshFaceMaterial = function ( materials ) {

	this.materials = materials instanceof Array ? materials : [];	//判断参数material的类型是否是数组对象.

};
/*************************************************************
****下面是MeshFaceMaterial对象的方法属性定义
*************************************************************/

/*clone方法
///clone方法克隆MeshFaceMaterial对象,
*/
///<summary>clone</summary>
///<returns type="MeshFaceMaterial">返回克隆的MeshFaceMaterial对象</returns>	
THREE.MeshFaceMaterial.prototype.clone = function () {

	var material = new THREE.MeshFaceMaterial();

	for ( var i = 0; i < this.materials.length; i ++ ) {

		material.materials.push( this.materials[ i ].clone() );

	}

	return material;	//返回克隆的MeshFaceMaterial对象

};