from pathlib import Path
import zlib
import base64

def compress_content(directory='public', dest='compressed_public.py'):
    dest_file = open(dest, 'wb')
    dest_file.write(b"data = {")
    first = True
    counter = 0

    to_analyse = [directory]

    while len(to_analyse) > 0:

        counter += 1
        current = str(to_analyse[0]).replace('\\', '/')
        del to_analyse[0]
        current_path = Path(current)

        if current_path.is_dir():
            for sub in current_path.iterdir():
                to_analyse.append(sub)
        else:
            print("processing: " + current)

            if first:
                first = False
            else:
                dest_file.write(b',')

            dest_file.write(bytes('\n    "' + current + '" : "', 'utf-8'))
            dest_file.write(base64.b85encode(zlib.compress(open(current_path, 'rb').read())))
            dest_file.write(b'"')


    dest_file.write(b"\n}")
    dest_file.close()

    print("\nSuccessfully compressed " + str(counter) + " files into " + dest)

def decompress_data(data):
    return zlib.decompress(base64.b85decode(data))

if __name__ == '__main__':
    compress_content()