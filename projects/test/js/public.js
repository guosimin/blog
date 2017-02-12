/**
 * Created by Administrator on 2017/2/12.
 */
/**
 * 使用angular.bootstrap完成模块的手动
 */
angular.element(document).ready(function () {
    angular.bootstrap(document, ["app"]);
});
var app = angular.module("app", []);


/**
 * mainCtrl 控制器
 */
app.controller('mainCtrl', ['$scope', function ($scope) {
    //============================数据源====================================
    /**
     * 模拟请求到的树
     * @type {*[]}
     */
    $scope.obj = [{
        id: 1,//id
        name: "父节点",//名字
        parentId: null,//上一级的id
        level: 1,//层级
        node: [
            {id: 11, parentId: 1, name: "节点1", level: 2},
            {
                id: 12, parentId: 1, name: "节点2", level: 2, node: [
                {id: 111, parentId: 12, name: "子节点1", level: 3},
                {
                    id: 112, parentId: 12, name: "子节点2", level: 3, node: [
                    {id: 1113, parentId: 112, name: "子子节点1", level: 4}
                ]
                }
            ]
            },
            {id: 13, parentId: 1, name: "节点3", level: 2}
        ]//节点
    }];


    //============================变量====================================
    $scope.objArray = [];//用于记录转化后树的数组
    $scope.selectIds = [];//用于记录选中的id
    $scope.selectItems = [];//用于记录选中的数组


    //=============================工具函数===================================
    /**
     * 安全$apply
     * @param fn 需要执行的方法，如果没$apply的会自动$apply，如果有则不用
     */
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    //=============================函数===================================

    /**
     * 用于将$scope.obj整理成$scope.objArray
     * @param node
     */
    function changeArray(node) {
        //用于记录需要保存的对象
        var postData = {};
        //第一项默认保存，排序的时候
        postData = {id: node.id, parentId: node.parentId, name: node.name, level: node.level};
        //如果有节点
        if (node.node) {
            //如果包含node要加上node
            postData = angular.extend(postData, {node: node.node});
            //然后把对象push进树的数组中
            $scope.objArray.push(postData);
            angular.forEach(node.node, function (data) {
                if (data.node) {
                    changeArray(data);
                } else {
                    $scope.objArray.push({
                        id: data.id,
                        parentId: data.parentId,
                        name: data.name,
                        level: data.level,
                        node: data.node
                    });
                }
            });
        } else {
            $scope.objArray.push(postData);
        }
    }
    

    /**
     * 选中当前项
     * @param item
     */
    function select(item) {
        var num = $scope.selectIds.indexOf(item.id);
        if (num == -1) {
            $scope.selectIds.push(item.id);
            $scope.selectItems.push(item);
        }
        if (item.node) {
            angular.forEach($scope.objArray, function (data) {
                if (data.parentId == item.id) {
                    select(data);
                }
            })
        }
    }

    /**
     * 如果子项都选中，则选中父级
     * @param item
     * @returns {boolean}
     */
    function selectParent(item) {
        var sameParentItems =  [];
        var parentItem;
        //获取相同层级的项，和父级item
        angular.forEach($scope.objArray,function (data) {
            if (item.parentId == data.parentId) {
                sameParentItems.push(data);
            }
            if(item.parentId == data.id){
                parentItem = data;
            }
        });

        //判断相同层级的项都选中了，如果是，则父级也选中
        for(var i = 0;i<sameParentItems.length;i++){
            var data = sameParentItems[i];
            var num = $scope.selectIds.indexOf(data.id);
            if (num==-1) {
                return false;
            }
            if(i==sameParentItems.length-1){
                if(parentItem){
                    $scope.selectIds.push(parentItem.id);
                    $scope.selectItems.push(parentItem);
                    selectParent(parentItem);
                }
            }
        }
    }

    /**
     * 取消当前项选择
     * @param item 当前数据源
     * @param selectItems 选中的item
     * @param selectIds 选中的ids
     */
    function unSelect(item, selectItems, selectIds) {
        var num = $scope.selectIds.indexOf(item.id);
        if (num != -1) {
            $scope.selectItems[num].check = false;
        }
        if (item.node) {
            angular.forEach($scope.selectItems, function (data) {
                if (data.parentId == item.id) {
                    var num2 = $scope.selectIds.indexOf(data.id);
                    if (num2 != -1) {
                        unSelect(data);
                    }
                }
            })
        }
    }

    /**
     * 取消父级选择
     **/
    function unSelectParent(item) {
        angular.forEach($scope.selectItems, function (data) {
            if (data.id == item.parentId) {
                var num = $scope.selectIds.indexOf(data.id);
                if (num != -1) {
                    $scope.selectItems[num].check = false;
                    unSelectParent(data);
                }
            }
        })
    }



    /**
     * 点击事件
     * @event 点击checkbox
     * @param item 当前数据
     */
    $scope.checkBoxClick = function (item) {
        var num = $scope.selectIds.indexOf(item.id);
        //是否已选择过的
        if (num == -1) {
            //更新选中
            $scope.safeApply(select(item));
            selectParent(item);
        } else {
            //取消父级选择
            $scope.safeApply(unSelectParent(item));
            //取消当前项选择
            $scope.safeApply(unSelect(item));

            angular.forEach($scope.objArray, function (data) {
                if (data.check === false) {
                    var num = $scope.selectIds.indexOf(data.id);
                    if (num != -1) {
                        $scope.selectIds.splice(num, 1);
                        $scope.selectItems.splice(num, 1);
                    }
                }
                delete data.check;
            });
        }
    }

    /**
     * 初始化方法
     */
    function init() {
        //得到$scope.objArray（树型数据转成数组）
        angular.forEach($scope.obj, function (data) {
            changeArray(data);
        });

        //得到树节点样式
        angular.forEach($scope.objArray, function (data) {
            data.style = {'padding-left': (data.level * 20) + "px"};
        });
    }

    //=============================初始化===================================
    init();
}])