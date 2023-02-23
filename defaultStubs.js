const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
    cout<<"Hello world!\\n";
    return 0;
}

`;

stubs.py = `print("Hello world!")

`;

stubs.java = `import java.util.*;
    public class Main {
    public static void main(String []args) {
       System.out.println("Hello World"); 
    }
 }`;


export default stubs;