<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('commodity:brand:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('commodity:brand:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="id">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="品牌名">
      </el-table-column>
      <el-table-column
        prop="logo"
        header-align="center"
        align="center"
        label="logo">
        <!-- 使用插槽机制，给表格的列加入一个 template,显示 logo 图片 -->
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="isshow"
        header-align="center"
        align="center"
        label="显示">
<!--        在 template 中使用 el-switch 控件，插入ElementUI-Switch 开关-->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isshow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeIsShow(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstLetter"
        header-align="center"
        align="center"
        label="检索首字母">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="relateCategoryHandle(scope.row.id)">关联分类</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"></add-or-update>
    <!-- 品牌和分类关联的对话框 -->
    <el-dialog title="关联分类" :visible.sync="cateRelationDialogVisible" width="30%">
      <el-popover placement="right-end" v-model="popCatelogSelectVisible">
        <!-- <category-cascader :catelogPath.sync="catelogPath"></category-cascader>-->
        <!-- 这里我们加入分类的 Cascader 级联选择器, 前面我们使用过 -->
        <el-cascader
          v-model="cascadedCategoryId" :options="categories" :props="props"></el-cascader>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="popCatelogSelectVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="addBrandCategoryRelation">确 定</el-button>
        </div>
        <el-button slot="reference">新增关联</el-button>
      </el-popover>
      <el-table :data="cateRelationTableData" style="width: 100%">
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column prop="brandName" label="品牌名"></el-table-column>
        <el-table-column prop="categoryName" label="分类名"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text" size="small"
              @click="deleteCateRelationHandle(scope.row.id,scope.row.brandId)">移 除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateRelationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateRelationDialogVisible = false">确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './brand-add-or-update'
  export default {
    data () {
      return {
        cateRelationDialogVisible: false,
        cateRelationTableData: [],
        cascadedCategoryId: [],
        popCatelogSelectVisible: false,
        props: { //显示返回的家居分类的哪些字段/信息
          value: "id",
          label: "name",
          children: "childrenCategories"
        },
        categories: [], //所有的家居分类
        brandId: 0,
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    created() {
      this.getCategories();
    },
    methods: {

      //删除品牌和分类的关联关系
      deleteCateRelationHandle(id, brandId) {
        console.log("id=" , id , " brandId=", brandId)
        this.$http({
          url: this.$http.adornUrl(`/commodity/categorybrandrelation/delete`),
          method: "post",
          data: this.$http.adornData([id], false)
        }).then(({data}) => {
          //删除成功，刷新列表
          this.getCategoryBrandRelation();
        });
      },

      //显示分类和品牌的关联关系
      getCategoryBrandRelation() {
        this.$http({
          url: this.$http.adornUrl(`/commodity/categorybrandrelation/brand/list`),
          params: this.$http.adornParams({
            brandId: this.brandId
          })
        }).then(({data}) => {
          console.log("data.data=", data)
          this.cateRelationTableData = data.data;
        });
      },

      //添加分类和品牌的关系
      addBrandCategoryRelation() {
        this.popCatelogSelectVisible = false;
        //检测数据,得到数据是否正确
        console.log("brandId=", this.brandId, "categoryId= ", this.cascadedCategoryId[this.cascadedCategoryId.length-1])
        this.$http({
          url: this.$http.adornUrl(`/commodity/categorybrandrelation/save`),
          method: 'post',
          data: this.$http.adornData({
            brandId: this.brandId,
            categoryId: this.cascadedCategoryId[this.cascadedCategoryId.length - 1]
          }, false)
        }).then(({data}) => {
          console.log("data.data=", data)
          //添加成功后，刷新一下分类和品牌关联表
          this.getCategoryBrandRelation();
        });
      },
      //显示关联品牌和分类的相关方法
      getCategories() {
        this.$http({
          url: this.$http.adornUrl(`/commodity/category/list/tree`),
        }).then(({data}) => {
          this.categories = data.data;
        });
      },
      //响应关联分类按钮的操作
      relateCategoryHandle(id) {
        console.log("id~= ", id)
        this.cateRelationDialogVisible = true;
        //得到 brandId 的值
        this.brandId = id;
        //显示当前分类和品牌的关联关系
        this.getCategoryBrandRelation();
      },

      //增加自定义方法
      changeIsShow(data) {
        console.log("修改状态= ", data);
        let {id, isshow} = data;
        //发送请求修改状态
        this.$http({
          // url: "http://localhost:9090/commodity/brand/update",
          url: this.$http.adornUrl(`/commodity/brand/update/isshow`),
          method: "post",
          //{id, isShow} 是 json 数据，完整的是{"id":id, "isShow": isShow}
          //key 名和值名相同，可以简写
          data: this.$http.adornData({id, isshow}, false)
        }).then(({data}) => {
          this.$message({
            type: "success",
            message: "显示更新 OK"
          });
        });
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          // url: 'http://localhost:9090/commodity/brand/list',
          url: this.$http.adornUrl(`/commodity/brand/list`),
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, name) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var names = name ? [name] : this.dataListSelections.map(item => {
          return item.name
        })
        this.$confirm(`确定对[name=${names.join(',')}]进行[${name ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            // url: 'http://localhost:9090/commodity/brand/delete',
            url: this.$http.adornUrl(`/commodity/brand/delete`),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }

</script>
