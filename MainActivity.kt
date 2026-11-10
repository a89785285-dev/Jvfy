package com.vanta.code

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Background = Color(0xFF090A10)
private val SurfaceDark = Color(0xFF151722)
private val Purple = Color(0xFF9B72FF)
private val Muted = Color(0xFF9AA0B2)

data class LibraryItem(
    val name: String,
    val purpose: String,
    val dependency: String,
    val category: String
)

private val libraries = listOf(
    LibraryItem("Gson", "قراءة وكتابة JSON", "implementation(\"com.google.code.gson:gson:2.11.0\")", "Data"),
    LibraryItem("OkHttp", "طلبات واتصالات HTTP", "implementation(\"com.squareup.okhttp3:okhttp:4.12.0\")", "Network"),
    LibraryItem("Zip4j", "إنشاء واستخراج ملفات ZIP", "implementation(\"net.lingala.zip4j:zip4j:2.11.5\")", "Files"),
    LibraryItem("JGit", "عمليات Git من Java", "implementation(\"org.eclipse.jgit:org.eclipse.jgit:6.10.0.202406032230-r\")", "Development"),
    LibraryItem("JavaPoet", "توليد ملفات Java برمجياً", "implementation(\"com.squareup:javapoet:1.13.0\")", "Code generation"),
    LibraryItem("KotlinPoet", "توليد ملفات Kotlin برمجياً", "implementation(\"com.squareup:kotlinpoet:1.18.1\")", "Code generation")
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { VantaApp() }
    }
}

@Composable
fun VantaApp() {
    var query by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    val context = LocalContext.current
    val categories = listOf("All", "Data", "Network", "Files", "Development", "Code generation")
    val shown = libraries.filter {
        (selectedCategory == "All" || it.category == selectedCategory) &&
        (it.name.contains(query, true) || it.purpose.contains(query, true))
    }

    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Purple,
            background = Background,
            surface = SurfaceDark,
            onBackground = Color.White,
            onSurface = Color.White
        )
    ) {
        Surface(Modifier.fillMaxSize(), color = Background) {
            Column(Modifier.fillMaxSize().padding(18.dp)) {
                Text("VANTA", color = Purple, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("CODE", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Black)
                Text("Android Library Manager", color = Muted, fontSize = 13.sp)
                Spacer(Modifier.height(20.dp))

                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("ابحث عن مكتبة...") },
                    leadingIcon = { Icon(Icons.Default.Search, null) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Purple,
                        unfocusedBorderColor = Color(0xFF343747),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    )
                )
                Spacer(Modifier.height(12.dp))

                Text("CATEGORIES", color = Muted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                    categories.take(3).forEach { category ->
                        CategoryChip(category, selectedCategory == category) { selectedCategory = category }
                    }
                }
                Spacer(Modifier.height(7.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                    categories.drop(3).forEach { category ->
                        CategoryChip(category, selectedCategory == category) { selectedCategory = category }
                    }
                }
                Spacer(Modifier.height(18.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("LIBRARY CATALOG", color = Color.White, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.weight(1f))
                    Text("${shown.size} libraries", color = Muted, fontSize = 12.sp)
                }
                Spacer(Modifier.height(10.dp))

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(bottom = 20.dp)
                ) {
                    items(shown) { item ->
                        LibraryCard(item) {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            clipboard.setPrimaryClip(ClipData.newPlainText("Gradle dependency", item.dependency))
                            Toast.makeText(context, "تم نسخ Dependency", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoryChip(label: String, selected: Boolean, onClick: () -> Unit) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = { Text(label, fontSize = 10.sp) },
        colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = Purple.copy(alpha = 0.22f),
            selectedLabelColor = Purple,
            labelColor = Muted
        )
    )
}

@Composable
private fun LibraryCard(item: LibraryItem, onCopy: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Column(Modifier.padding(15.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(item.name, color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    Text(item.category, color = Purple, fontSize = 10.sp)
                }
                TextButton(onClick = onCopy) {
                    Icon(Icons.Default.ContentCopy, null, tint = Purple, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(5.dp))
                    Text("Copy", color = Purple)
                }
            }
            Spacer(Modifier.height(5.dp))
            Text(item.purpose, color = Muted, fontSize = 12.sp)
            Spacer(Modifier.height(10.dp))
            Text(
                item.dependency,
                color = Color(0xFFB9A5FF),
                fontSize = 10.sp,
                modifier = Modifier.fillMaxWidth().background(Color(0xFF0D0F17), RoundedCornerShape(8.dp)).padding(9.dp)
            )
        }
    }
}
