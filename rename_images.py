import os

# 图片文件夹路径
image_dir = r'C:\Users\abc\Desktop\用于模板\image'

# 获取所有图片文件
image_files = [f for f in os.listdir(image_dir) if f.endswith('.jpg')]

# 按顺序重命名
for i, filename in enumerate(image_files, 1):
    old_path = os.path.join(image_dir, filename)
    new_name = f'{i}.jpg'
    new_path = os.path.join(image_dir, new_name)
    
    os.rename(old_path, new_path)
    print(f'Renamed: {filename} -> {new_name}')